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

export interface DemoAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tier: 1 | 2;
  organization: string;
  department?: string;
}

/**
 * Public demo accounts safe for client bundles.
 * CRITICAL: Zero passwords or password hashes are bundled into client code.
 */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'dean.admin@college.gov.in',
    name: 'Dr. Rameshwar Sharma (Dean of Administration)',
    role: 'admin',
    tier: 1,
    organization: 'Govt. Central College Administrative Directorate',
    department: 'Directorate of Public Assets & Oversight',
  },
  {
    id: 'b1111111-2222-3333-4444-555555555001',
    email: 'nodal.officer@prathamyouth.org',
    name: 'Ananya Deshmukh (Secretary)',
    role: 'ngo',
    tier: 1,
    organization: 'Pratham Youth Education Initiative (NGO)',
    department: 'Community Outreach & Digital Literacy',
  },
  {
    id: 'c2222222-3333-4444-5555-666666666002',
    email: 'csr.lead@apexinfo.com',
    name: 'Vikramaditya Roy (CSR Director)',
    role: 'corporate',
    tier: 2,
    organization: 'Apex Infotech Solutions Ltd (CSR Wing)',
    department: 'Corporate Social Responsibility & Innovation',
  },
];

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
