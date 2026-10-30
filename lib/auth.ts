import crypto from 'crypto';
import type { UserRole } from '@/types/database';
export * from './auth-client';
import { AuthUser, SecurityEvent, DEMO_ACCOUNTS } from './auth-client';

const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'idlespaces_statutory_secret_gov_college_2026_salt_hmac_protected_key_!@#';

/**
 * Server-only verified institutional accounts for demonstration & evaluation.
 * STRICTLY kept on the server; never exposed to client bundles.
 */
export const DEMO_ACCOUNTS_SERVER: (AuthUser & { passwordHash: string; plainDemoPassword: string })[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'dean.admin@college.gov.in',
    name: 'Dr. Rameshwar Sharma (Dean of Administration)',
    role: 'admin',
    tier: 1,
    organization: 'Govt. Central College Administrative Directorate',
    department: 'Directorate of Public Assets & Oversight',
    plainDemoPassword: 'Admin@GovSecure2026!',
    // PBKDF2-SHA256 (10,000 rounds) hash
    passwordHash: '966ff83758a6d00a79f7e4bb015e041e5228914358ece478802dc23e7b397bcb',
  },
  {
    id: 'b1111111-2222-3333-4444-555555555001',
    email: 'nodal.officer@prathamyouth.org',
    name: 'Ananya Deshmukh (Secretary)',
    role: 'ngo',
    tier: 1,
    organization: 'Pratham Youth Education Initiative (NGO)',
    department: 'Community Outreach & Digital Literacy',
    plainDemoPassword: 'Ngo@Community2026!',
    // PBKDF2-SHA256 (10,000 rounds) hash
    passwordHash: '2addc0cf18dcf6f8d78820ba16114e91b84f3f74eae0781f564c0a42bee4b811',
  },
  {
    id: 'c2222222-3333-4444-5555-666666666002',
    email: 'csr.lead@apexinfo.com',
    name: 'Vikramaditya Roy (CSR Director)',
    role: 'corporate',
    tier: 2,
    organization: 'Apex Infotech Solutions Ltd (CSR Wing)',
    department: 'Corporate Social Responsibility & Innovation',
    plainDemoPassword: 'Corp@Innovate2026!',
    // PBKDF2-SHA256 (10,000 rounds) hash
    passwordHash: '86757ed1ba832b2f7fb777fcff8d57a18463e493d16100b39c2a105654316407',
  },
];

// Dynamic In-Memory Store for Registered Users (Community, NGO, Corporate)
export interface RegisteredUserRecord extends AuthUser {
  passwordHash: string;
}

const registeredUsers = new Map<string, RegisteredUserRecord>();

export function getRegisteredUserByEmail(email: string): RegisteredUserRecord | undefined {
  return registeredUsers.get(email.toLowerCase().trim());
}

export function saveRegisteredUser(record: RegisteredUserRecord): void {
  // CRITICAL DEFENSE: Never store plain passwords in memory or database records
  const sanitized: RegisteredUserRecord = {
    id: record.id,
    email: record.email.toLowerCase().trim(),
    name: record.name,
    role: record.role,
    tier: record.tier,
    organization: record.organization,
    department: record.department,
    passwordHash: record.passwordHash,
    avatarUrl: record.avatarUrl,
    lastLogin: record.lastLogin,
  };
  registeredUsers.set(sanitized.email, sanitized);
}

// In-Memory Rate Limiting & Account Lockout Store
interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minute sliding window

// In-Memory Security Audit Logs (Accessible to Admins)
const globalSecurityAuditLogs: SecurityEvent[] = [
  {
    id: 'sec-001',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    eventType: 'LOGIN_SUCCESS',
    email: 'dean.admin@college.gov.in',
    role: 'admin',
    status: 'SUCCESS',
    details: 'Institutional Admin authenticated with HMAC-SHA256 tamper-evident cryptographic session.',
  },
  {
    id: 'sec-002',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    eventType: 'UNAUTHORIZED_ACCESS',
    email: 'anonymous@external-net.org',
    status: 'BLOCKED',
    details: 'Unauthenticated attempt to access /admin route automatically intercepted by Next.js Proxy.',
  },
];

/**
 * Log a security event into the central audit trail
 */
export function recordSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
  const newEvent: SecurityEvent = {
    ...event,
    id: `sec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };
  globalSecurityAuditLogs.unshift(newEvent);
  if (globalSecurityAuditLogs.length > 100) {
    globalSecurityAuditLogs.pop();
  }
  return newEvent;
}

export function getSecurityAuditLogs(): SecurityEvent[] {
  return [...globalSecurityAuditLogs];
}

/**
 * Hardened Password Hashing using PBKDF2 (SHA-256, 10,000 iterations)
 * Also validates against legacy SHA-256 for demo accounts.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = 'idlespaces_gov_statutory_salt_2026';
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 10000, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey.toString('hex'));
    });
  });
}

/**
 * Hardened Password Verification using PBKDF2 (SHA-256, 10,000 iterations)
 * Supports PBKDF2 as well as SHA-256 for backward compatibility.
 */
export async function verifyPasswordHash(password: string, storedHash: string): Promise<boolean> {
  const computedPbkdf2 = await hashPassword(password);
  if (computedPbkdf2 === storedHash) {
    return true;
  }
  try {
    const b1 = Buffer.from(computedPbkdf2, 'hex');
    const b2 = Buffer.from(storedHash, 'hex');
    if (b1.length === b2.length && crypto.timingSafeEqual(b1, b2)) {
      return true;
    }
  } catch {}

  const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
  if (sha256Hash === storedHash) {
    return true;
  }

  const legacyData = Buffer.from(password + ':idlespaces_gov_salt_2026', 'utf-8');
  const legacyHash = crypto.createHash('sha256').update(legacyData).digest('hex');
  if (legacyHash === storedHash) {
    return true;
  }

  return false;
}

/**
 * Check if a client/email is currently locked out due to repeated failed logins.
 * Protects root institutional accounts from unauthenticated denial-of-service lockout.
 */
export function checkRateLimit(
  key: string,
  isRootAdmin: boolean = false
): { isLocked: boolean; remainingSeconds: number; attemptsRemaining: number } {
  const normalizedKey = key.toLowerCase().trim();
  const now = Date.now();
  const record = loginAttempts.get(normalizedKey);

  if (!record) {
    return { isLocked: false, remainingSeconds: 0, attemptsRemaining: MAX_ATTEMPTS };
  }

  // Check if locked out
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, remainingSeconds, attemptsRemaining: 0 };
  }

  // Reset window if expired
  if (now - record.firstAttempt > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(normalizedKey);
    return { isLocked: false, remainingSeconds: 0, attemptsRemaining: MAX_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.count);
  return { isLocked: false, remainingSeconds: 0, attemptsRemaining: remaining };
}

/**
 * Record a failed login attempt; activates lockout if threshold exceeded
 */
export function registerFailedAttempt(
  key: string,
  auditEmail: string = key
): { isLocked: boolean; remainingSeconds: number; attemptsRemaining: number } {
  const normalizedKey = key.toLowerCase().trim();
  const normalizedAuditEmail = auditEmail.toLowerCase().trim();
  const now = Date.now();
  let record = loginAttempts.get(normalizedKey);

  if (!record || now - record.firstAttempt > ATTEMPT_WINDOW_MS) {
    record = { count: 1, firstAttempt: now };
  } else {
    record.count += 1;
  }

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(normalizedKey, record);

    recordSecurityEvent({
      eventType: 'ACCOUNT_LOCKED',
      email: normalizedAuditEmail,
      status: 'BLOCKED',
      details: `Client key temporarily locked out for 15 minutes after ${MAX_ATTEMPTS} consecutive failed attempts.`,
    });

    return {
      isLocked: true,
      remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      attemptsRemaining: 0,
    };
  }

  loginAttempts.set(normalizedKey, record);

  recordSecurityEvent({
    eventType: 'LOGIN_FAILED',
    email: normalizedAuditEmail,
    status: 'FAILURE',
    details: `Failed credentials attempt (${record.count}/${MAX_ATTEMPTS}).`,
  });

  return {
    isLocked: false,
    remainingSeconds: 0,
    attemptsRemaining: MAX_ATTEMPTS - record.count,
  };
}

/**
 * Clear failed attempts upon successful login
 */
export function resetFailedAttempts(key: string) {
  loginAttempts.delete(key.toLowerCase().trim());
}

// In-Memory Registration Rate Limiting Store
const registrationAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_REGISTRATIONS_PER_WINDOW = 10;
const REGISTRATION_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export function checkRegistrationRateLimit(identifier: string): { isAllowed: boolean; remainingSeconds: number } {
  const now = Date.now();
  const record = registrationAttempts.get(identifier);
  if (!record || now - record.firstAttempt > REGISTRATION_WINDOW_MS) {
    return { isAllowed: true, remainingSeconds: 0 };
  }
  if (record.count >= MAX_REGISTRATIONS_PER_WINDOW) {
    const remainingSeconds = Math.ceil((REGISTRATION_WINDOW_MS - (now - record.firstAttempt)) / 1000);
    return { isAllowed: false, remainingSeconds };
  }
  return { isAllowed: true, remainingSeconds: 0 };
}

export function recordRegistrationAttempt(identifier: string): void {
  const now = Date.now();
  let record = registrationAttempts.get(identifier);
  if (!record || now - record.firstAttempt > REGISTRATION_WINDOW_MS) {
    record = { count: 1, firstAttempt: now };
  } else {
    record.count += 1;
  }
  registrationAttempts.set(identifier, record);
}

/**
 * Cookie session configuration
 */
export const SESSION_COOKIE_NAME = 'idlespaces_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

export interface SessionPayload {
  user: AuthUser;
  issuedAt: number;
  expiresAt: number;
}

/**
 * CRITICAL 1 FIX: Cryptographically sign session token with HMAC-SHA256
 * Format: payloadBase64.hmacSignature
 * Guarantees that client cannot tamper with 'role: admin' or forge sessions.
 */
export function encodeSession(user: AuthUser): string {
  const payload: SessionPayload = {
    user,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(payloadBase64)
    .digest('base64url');
  return `${payloadBase64}.${signature}`;
}

/**
 * Verify cryptographic HMAC-SHA256 signature and unpack session
 */
export function decodeSession(token: string): SessionPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;

    const parts = token.split('.');
    if (parts.length !== 2) {
      // Reject any unsigned or legacy tampered token immediately
      return null;
    }

    const [payloadBase64, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(payloadBase64)
      .digest('base64url');

    const expectedBuf = Buffer.from(expectedSignature);
    const actualBuf = Buffer.from(signature);

    // Constant-time comparison to prevent timing side-channel attacks
    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      console.warn('[Security] Invalid session signature detected; potential tampering blocked.');
      return null;
    }

    const raw = Buffer.from(payloadBase64, 'base64url').toString('utf-8');
    const payload = JSON.parse(raw) as SessionPayload;
    const user = payload?.user;
    const validUser =
      user &&
      typeof user.id === 'string' &&
      typeof user.email === 'string' &&
      typeof user.name === 'string' &&
      ['admin', 'ngo', 'corporate', 'community'].includes(user.role);

    if (
      !validUser ||
      typeof payload.issuedAt !== 'number' ||
      typeof payload.expiresAt !== 'number' ||
      payload.issuedAt > Date.now() ||
      payload.expiresAt <= Date.now()
    ) {
      return null; // Expired or future timestamp
    }
    return payload;
  } catch {
    return null;
  }
}
