'use server';

import { cookies } from 'next/headers';
import {
  AuthUser,
  DEMO_ACCOUNTS,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  checkRateLimit,
  decodeSession,
  encodeSession,
  getSecurityAuditLogs,
  recordSecurityEvent,
  registerFailedAttempt,
  resetFailedAttempts,
} from '@/lib/auth';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

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

  // 2. Check Brute Force Lockout
  const limitCheck = checkRateLimit(email);
  if (limitCheck.isLocked) {
    return {
      success: false,
      error: `Security Alert: Account access is temporarily locked due to repeated failed logins. Please retry after ${limitCheck.remainingSeconds} seconds.`,
      isLocked: true,
      remainingSeconds: limitCheck.remainingSeconds,
      attemptsRemaining: 0,
    };
  }

  // 3. Check Demo Accounts First for immediate testing & judging
  const demoMatch = DEMO_ACCOUNTS.find(
    (acc) => acc.email.toLowerCase() === email && acc.plainDemoPassword === password
  );

  let authenticatedUser: AuthUser | null = null;

  if (demoMatch) {
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
  } else {
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
          // Fetch role from users table
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
    const failureRecord = registerFailedAttempt(email);

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
  resetFailedAttempts(email);

  // 7. Record central security audit event
  recordSecurityEvent({
    eventType: 'LOGIN_SUCCESS',
    email: authenticatedUser.email,
    role: authenticatedUser.role,
    status: 'SUCCESS',
    details: `User authenticated as ${authenticatedUser.role.toUpperCase()} (${authenticatedUser.organization}). Session token established.`,
  });

  // 8. Issue HttpOnly secure session cookie
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

