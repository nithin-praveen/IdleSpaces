'use server';

import { cookies, headers } from 'next/headers';
import {
  AuthUser,
  DEMO_ACCOUNTS,
  DEMO_ACCOUNTS_SERVER,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  checkRateLimit,
  checkRegistrationRateLimit,
  decodeSession,
  encodeSession,
  getRegisteredUserByEmail,
  getSecurityAuditLogs,
  hashPassword,
  recordRegistrationAttempt,
  recordSecurityEvent,
  registerFailedAttempt,
  resetFailedAttempts,
  saveRegisteredUser,
  verifyPasswordHash,
} from '@/lib/auth';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export interface RegisterUserInput {
  name: string;
  email: string;
  organization: string;
  role: 'ngo' | 'corporate';
  password: string;
  department?: string;
}

export type LoginResult =
  | { success: true; user: AuthUser; message?: string }
  | {
      success: false;
      error: string;
      isLocked?: boolean;
      remainingSeconds?: number;
      attemptsRemaining?: number;
    };

/**
 * Handle user authentication with anti-brute force, statutory logging, and secure HttpOnly cookie session
 */
export async function loginAction(
  emailInput: string,
  passwordInput: string
): Promise<LoginResult> {
  const email = emailInput?.toLowerCase().trim();
  const password = passwordInput?.trim();

  // 1. Input sanitization & validation
  if (!email || !password) {
    return {
      success: false,
      error: 'Institutional email address and password are required.',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: 'Please enter a valid institutional or organizational email address.',
    };
  }

  // Determine client IP to prevent brute-force DoS lockout of administrative accounts
  const headerStore = await headers();
  const clientIp = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const isRootAdmin = email === 'dean.admin@college.gov.in';
  const rateLimitKey = isRootAdmin ? `${clientIp}:${email}` : email;

  // 2. Check Brute Force Lockout
  const limitCheck = checkRateLimit(rateLimitKey, isRootAdmin);
  if (limitCheck.isLocked) {
    return {
      success: false,
      error: `Security Alert: Account access is temporarily locked due to repeated failed logins. Please retry after ${limitCheck.remainingSeconds} seconds.`,
      isLocked: true,
      remainingSeconds: limitCheck.remainingSeconds,
      attemptsRemaining: 0,
    };
  }

  // 3. Check Demo Accounts First for immediate testing & evaluation (Server-only credentials)
  const demoMatch = DEMO_ACCOUNTS_SERVER.find(
    (acc) => acc.email.toLowerCase() === email
  );

  let authenticatedUser: AuthUser | null = null;

  if (demoMatch) {
    const isMatch =
      demoMatch.plainDemoPassword === password ||
      (await verifyPasswordHash(password, demoMatch.passwordHash));

    if (isMatch) {
      authenticatedUser = {
        id: demoMatch.id,
        email: demoMatch.email,
        name: demoMatch.name,
        role: demoMatch.role,
        tier: demoMatch.tier,
        organization: demoMatch.organization,
        department: demoMatch.department,
        lastLogin: new Date().toISOString(),
      };
    }
  } else {
    // 3b. Check dynamically registered users with PBKDF2 verification
    const registered = getRegisteredUserByEmail(email);
    if (registered) {
      const isMatch = await verifyPasswordHash(password, registered.passwordHash);
      if (isMatch) {
        authenticatedUser = {
          id: registered.id,
          email: registered.email,
          name: registered.name,
          role: registered.role,
          tier: registered.tier,
          organization: registered.organization,
          department: registered.department,
          lastLogin: new Date().toISOString(),
        };
      }
    }
  }

  if (!authenticatedUser) {
    // 4. Try Supabase Auth if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (
      supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes('placeholder') &&
      !supabaseUrl.includes('your-project')
    ) {
      try {
        const cookieStore = await cookies();
        const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) => {
                  cookieStore.set(name, value, options);
                });
              } catch {
                // Ignore in Server Action
              }
            },
          },
        });

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!authError && authData.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          authenticatedUser = {
            id: authData.user.id,
            email: authData.user.email || email,
            name: profile?.name || authData.user.user_metadata?.full_name || 'Authenticated Officer',
            role: profile?.role || 'ngo',
            tier: profile?.tier || (profile?.role === 'corporate' ? 2 : 1),
            organization: profile?.name || 'Authorized Entity',
            lastLogin: new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn('[loginAction] Supabase auth attempt fallback:', err);
      }
    }
  }

  // 5. If Authentication Fails
  if (!authenticatedUser) {
    const failureRecord = registerFailedAttempt(rateLimitKey, email);

    if (failureRecord.isLocked) {
      return {
        success: false,
        error: `Security Alert: Account has been locked for 15 minutes due to 5 consecutive failed attempts.`,
        isLocked: true,
        remainingSeconds: failureRecord.remainingSeconds,
        attemptsRemaining: 0,
      };
    }

    return {
      success: false,
      error: `Invalid credentials. ${failureRecord.attemptsRemaining} attempt(s) remaining before automatic statutory account lockout.`,
      attemptsRemaining: failureRecord.attemptsRemaining,
    };
  }

  // 6. Reset rate limit counter on success
  resetFailedAttempts(rateLimitKey);

  // 7. Record central security audit event
  recordSecurityEvent({
    eventType: 'LOGIN_SUCCESS',
    email: authenticatedUser.email,
    role: authenticatedUser.role,
    status: 'SUCCESS',
    details: `User authenticated as ${authenticatedUser.role.toUpperCase()} (${authenticatedUser.organization}). HMAC session established.`,
  });

  // 8. Issue HttpOnly secure signed session cookie
  const cookieStore = await cookies();
  const sessionToken = encodeSession(authenticatedUser);

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return {
    success: true,
    user: authenticatedUser,
    message: `Welcome back, ${authenticatedUser.name}. Authenticated securely as ${authenticatedUser.role.toUpperCase()}.`,
  };
}

/**
 * Direct 1-click authentication for authorized demo accounts.
 * Safe for client-side demo role selectors — zero credentials bundled to the browser.
 */
export async function loginWithDemoAccountAction(accountId: string): Promise<LoginResult> {
  const demoMatch = DEMO_ACCOUNTS_SERVER.find((acc) => acc.id === accountId);
  if (!demoMatch) {
    return { success: false, error: 'Unauthorized demo account selection.' };
  }

  const authenticatedUser: AuthUser = {
    id: demoMatch.id,
    email: demoMatch.email,
    name: demoMatch.name,
    role: demoMatch.role,
    tier: demoMatch.tier,
    organization: demoMatch.organization,
    department: demoMatch.department,
    lastLogin: new Date().toISOString(),
  };

  recordSecurityEvent({
    eventType: 'LOGIN_SUCCESS',
    email: authenticatedUser.email,
    role: authenticatedUser.role,
    status: 'SUCCESS',
    details: `Demo account authenticated as ${authenticatedUser.role.toUpperCase()} (${authenticatedUser.organization}). HMAC session token established.`,
  });

  const cookieStore = await cookies();
  const sessionToken = encodeSession(authenticatedUser);

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return {
    success: true,
    user: authenticatedUser,
    message: `Welcome back, ${authenticatedUser.name}.`,
  };
}

/**
 * Terminate user session and clear authentication cookie
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  const existingCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (existingCookie) {
    const session = decodeSession(existingCookie);
    if (session?.user) {
      recordSecurityEvent({
        eventType: 'LOGOUT',
        email: session.user.email,
        role: session.user.role,
        status: 'SUCCESS',
        details: `User session cleanly terminated. HttpOnly cookie invalidated.`,
      });
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

/**
 * Retrieve the current authenticated session on the server
 */
export async function getCurrentUserAction(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const payload = decodeSession(sessionToken);
  return payload?.user ?? null;
}

/**
 * Retrieve security logs for Dean/Admin review
 */
export async function getSecurityAuditLogsAction() {
  const user = await getCurrentUserAction();
  if (!user || user.role !== 'admin') {
    return {
      success: false,
      error: 'Statutory 403 Forbidden: Only verified Institutional Administrators can inspect the central security audit ledger.',
      data: [],
    };
  }

  return {
    success: true,
    data: getSecurityAuditLogs(),
  };
}

/**
 * Register a new applicant or community organization user
 */
export async function registerUserAction(input: RegisterUserInput): Promise<LoginResult> {
  const headerStore = await headers();
  const clientIp = headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';

  // 0. Rate limiting for registration
  const regLimit = checkRegistrationRateLimit(clientIp);
  if (!regLimit.isAllowed) {
    return {
      success: false,
      error: `Registration limit reached for this network. Please retry in ${regLimit.remainingSeconds} seconds.`,
    };
  }

  const name = input.name?.trim();
  const email = input.email?.toLowerCase().trim();
  const organization = input.organization?.trim();
  const role = input.role;
  const password = input.password?.trim();
  const department = input.department?.trim();

  // 1. Validation
  if (!name || name.length < 2) {
    return { success: false, error: 'Full name or representative name is required (min 2 characters).' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'A valid email address is required.' };
  }
  if (!organization || organization.length < 2) {
    return { success: false, error: 'Organization or community entity name is required.' };
  }
  if (!['ngo', 'corporate'].includes(role)) {
    return { success: false, error: 'Please select a valid role (NGO/Societal or Private).' };
  }
  if (!password || password.length < 8) {
    return { success: false, error: 'Password must contain at least 8 characters.' };
  }

  // 2. Check duplicate email in DEMO_ACCOUNTS or registeredUsers
  const existsInDemo = DEMO_ACCOUNTS.some((acc) => acc.email.toLowerCase() === email);
  const existsInRegistered = getRegisteredUserByEmail(email);
  if (existsInDemo || existsInRegistered) {
    return {
      success: false,
      error: 'An account with this email address already exists. Please sign in or use a different email.',
    };
  }

  // Record rate limit attempt
  recordRegistrationAttempt(clientIp);

  // 3. Hash password using PBKDF2 (10,000 iterations)
  const passwordHash = await hashPassword(password);
  const userId = `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const tier: 1 | 2 = role === 'ngo' ? 1 : 2;

  const newUser: AuthUser = {
    id: userId,
    email,
    name,
    role,
    tier,
    organization,
    department: department || (role === 'ngo' ? 'Community Outreach' : 'Private Sector Relations'),
    lastLogin: new Date().toISOString(),
  };

  // 4. Save to in-memory store (never stores plain password)
  saveRegisteredUser({
    ...newUser,
    passwordHash,
  });

  // 5. Optionally sync to Supabase if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('your-project')
  ) {
    try {
      const cookieStore = await cookies();
      const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch {}
          },
        },
      });

      // Force role to non-admin on remote signup to prevent self-elevation
      const { data: authData } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, organization, role: role === 'corporate' ? 'corporate' : 'ngo' },
        },
      });

      if (authData?.user) {
        newUser.id = authData.user.id;
        await supabase.from('users').upsert({
          id: authData.user.id,
          name,
          role,
          tier,
        });
      }
    } catch (err) {
      console.warn('[registerUserAction] Remote Supabase signup skipped (fallback in memory):', err);
    }
  }

  // 6. Record security audit log
  recordSecurityEvent({
    eventType: 'LOGIN_SUCCESS',
    email,
    role,
    status: 'SUCCESS',
    details: `New ${role.toUpperCase()} account successfully registered: ${name} (${organization}). Session issued.`,
  });

  // 7. Issue HttpOnly HMAC-signed session cookie
  const cookieStore = await cookies();
  const sessionToken = encodeSession(newUser);
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  return {
    success: true,
    user: newUser,
    message: `Account created successfully! Welcome to IdleSpaces, ${name}.`,
  };
}
