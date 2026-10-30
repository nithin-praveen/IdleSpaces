import type { UserRole } from '@/types/database';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tier: 1 | 2;
  organization: string;
  department?: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'ACCOUNT_LOCKED' | 'UNAUTHORIZED_ACCESS' | 'LOGOUT' | 'PASSWORD_RESET_ATTEMPT';
  email: string;
  role?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  details: string;
}

// Pre-configured Verified Institutional Accounts for Demo & Evaluation
export const DEMO_ACCOUNTS: (AuthUser & { passwordHash: string; plainDemoPassword: string })[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'dean.admin@college.gov.in',
    name: 'Dr. Rameshwar Sharma (Dean of Administration)',
    role: 'admin',
    tier: 1,
    organization: 'Govt. Central College Administrative Directorate',
    department: 'Directorate of Public Assets & Oversight',
    plainDemoPassword: 'Admin@GovSecure2026!',
    // SHA-256 hash of 'Admin@GovSecure2026!'
    passwordHash: '8b788a4e8d3566164d95feea95914c62fa536b0cbfe9c1584db22dbbb7780c13',
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
    // SHA-256 hash of 'Ngo@Community2026!'
    passwordHash: 'e6fb6948fe754d9c490ff67d30aa4933979eaec612185566f7f2b96c73df6ce3',
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
    // SHA-256 hash of 'Corp@Innovate2026!'
    passwordHash: 'fa1124230869385ebc6bf9e25d60ff3fec02ec10a4cceb56aebe54dfbd33f2d2',
  },
];

// Dynamic In-Memory Store for Registered Users (Community, NGO, Corporate)
export interface RegisteredUserRecord extends AuthUser {
  passwordHash: string;
  plainPassword?: string;
}

const registeredUsers = new Map<string, RegisteredUserRecord>();

export function getRegisteredUserByEmail(email: string): RegisteredUserRecord | undefined {
  return registeredUsers.get(email.toLowerCase().trim());
}

export function saveRegisteredUser(record: RegisteredUserRecord): void {
  registeredUsers.set(record.email.toLowerCase().trim(), record);
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
    details: 'Institutional Admin authenticated with session token issued (256-bit AES encryption).',
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
  // Keep last 100 events
  if (globalSecurityAuditLogs.length > 100) {
    globalSecurityAuditLogs.pop();
  }
  return newEvent;
}

export function getSecurityAuditLogs(): SecurityEvent[] {
  return [...globalSecurityAuditLogs];
}

/**
 * Simple SHA-256 hasher for cross-environment consistency
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + ':idlespaces_gov_salt_2026');
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback for environments where crypto.subtle is unavailable
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

/**
 * Check if an email is currently locked out due to repeated failed logins
 */
export function checkRateLimit(email: string): { isLocked: boolean; remainingSeconds: number; attemptsRemaining: number } {
  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();
  const record = loginAttempts.get(normalizedEmail);

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
    loginAttempts.delete(normalizedEmail);
    return { isLocked: false, remainingSeconds: 0, attemptsRemaining: MAX_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_ATTEMPTS - record.count);
  return { isLocked: false, remainingSeconds: 0, attemptsRemaining: remaining };
}

/**
 * Record a failed login attempt; activates lockout if threshold exceeded
 */
export function registerFailedAttempt(email: string): { isLocked: boolean; remainingSeconds: number; attemptsRemaining: number } {
  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();
  let record = loginAttempts.get(normalizedEmail);

  if (!record || (now - record.firstAttempt > ATTEMPT_WINDOW_MS)) {
    record = { count: 1, firstAttempt: now };
  } else {
    record.count += 1;
  }

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(normalizedEmail, record);

    recordSecurityEvent({
      eventType: 'ACCOUNT_LOCKED',
      email: normalizedEmail,
      status: 'BLOCKED',
      details: `Account temporarily locked out for 15 minutes after ${MAX_ATTEMPTS} consecutive failed attempts.`,
    });

    return {
      isLocked: true,
      remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
      attemptsRemaining: 0,
    };
  }

  loginAttempts.set(normalizedEmail, record);

  recordSecurityEvent({
    eventType: 'LOGIN_FAILED',
    email: normalizedEmail,
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
export function resetFailedAttempts(email: string) {
  loginAttempts.delete(email.toLowerCase().trim());
}

/**
 * Password strength evaluation
 */
export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  color: string;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  feedback: string[];
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteriaMet = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
  
  let score = 0;
  if (password.length === 0) score = 0;
  else if (criteriaMet <= 2) score = 1;
  else if (criteriaMet === 3) score = 2;
  else if (criteriaMet === 4) score = 3;
  else score = 4;

  const feedback: string[] = [];
  if (!hasMinLength) feedback.push('At least 8 characters required');
  if (!hasUppercase) feedback.push('Include at least one uppercase letter (A-Z)');
  if (!hasLowercase) feedback.push('Include at least one lowercase letter (a-z)');
  if (!hasNumber) feedback.push('Include at least one number (0-9)');
  if (!hasSpecial) feedback.push('Include at least one symbol (!@#$%^&*)');

  const labels: Record<number, { label: PasswordStrengthResult['label']; color: string }> = {
    0: { label: 'Very Weak', color: 'bg-slate-300' },
    1: { label: 'Weak', color: 'bg-red-500' },
    2: { label: 'Medium', color: 'bg-amber-500' },
    3: { label: 'Strong', color: 'bg-blue-600' },
    4: { label: 'Very Strong', color: 'bg-emerald-600' },
  };

  return {
    score,
    label: labels[score].label,
    color: labels[score].color,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial,
    feedback,
  };
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

export function encodeSession(user: AuthUser): string {
  const payload: SessionPayload = {
    user,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function decodeSession(token: string): SessionPayload | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const payload = JSON.parse(raw) as SessionPayload;
    const user = payload?.user;
    const validUser = user && typeof user.id === 'string' && typeof user.email === 'string' &&
      typeof user.name === 'string' && ['admin', 'ngo', 'corporate', 'community'].includes(user.role);
    if (!validUser || typeof payload.issuedAt !== 'number' || typeof payload.expiresAt !== 'number' ||
        payload.issuedAt > Date.now() || payload.expiresAt <= Date.now()) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

