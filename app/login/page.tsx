'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  evaluatePasswordStrength,
  DEMO_ACCOUNTS,
  type PasswordStrengthResult,
} from '@/lib/auth';
import { useAuth } from '@/components/AuthProvider';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Clock,
  KeyRound,
  ArrowUpRight,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();

  const redirectTarget = searchParams.get('redirect') || '/admin';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [remainingLockout, setRemainingLockout] = React.useState<number>(0);

  const strength: PasswordStrengthResult = React.useMemo(() => {
    return evaluatePasswordStrength(password);
  }, [password]);

  React.useEffect(() => {
    if (errorParam === 'admin_required') {
      setErrorMessage("Access Denied: The Dean's Review requires verified Institutional Administrator privileges. Please authenticate as Admin.");
    } else if (errorParam === 'login_required') {
      setErrorMessage('Authentication Required: Please sign in with your verified institutional account to continue.');
    }
  }, [errorParam]);

  React.useEffect(() => {
    if (remainingLockout <= 0) return;
    const interval = setInterval(() => {
      setRemainingLockout((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setErrorMessage(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingLockout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (remainingLockout > 0) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        const dest = searchParams.get('redirect') || '/admin';
        window.location.href = dest;
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please verify your credentials.');
        if (result.remainingSeconds && result.remainingSeconds > 0) {
          setRemainingLockout(result.remainingSeconds);
        }
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected security exception occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = async (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.plainDemoPassword);
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const res = await login(acc.email, acc.plainDemoPassword);
      if (res.success) {
        const dest = acc.role === 'admin' ? '/admin' : '/discover';
        window.location.href = dest;
        return;
      }
    } catch {
      // fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] overflow-hidden">
      {/* Portal Switcher Banner */}
      <div className="grid grid-cols-2 text-xs font-display font-extrabold border-b-2 border-[#1C1D1A]">
        <Link
          href="/user/login"
          className="flex items-center justify-center gap-1.5 py-3 px-3 bg-[#FCF8D8] text-[#1C1D1A] hover:bg-[#D9DADF] border-r-2 border-[#1C1D1A] transition-colors text-center cursor-pointer"
        >
          <span>👥 User & NGO Portal</span>
        </Link>
        <div className="flex items-center justify-center gap-1.5 py-3 px-3 bg-[#1C1D1A] text-[#FCF8D8] text-center">
          <ShieldCheck className="h-3.5 w-3.5 text-[#DD700B]" />
          <span>🏛️ Dean / Admin SSO</span>
        </div>
      </div>

      {/* Header with Security Ribbon */}
      <div className="bg-[#7C7D75] px-6 py-5 text-[#FCF8D8] border-b-2 border-[#1C1D1A] flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] text-[10px] font-display font-extrabold uppercase tracking-wider mb-1.5 border border-[#FCF8D8]/20">
            <ShieldCheck className="h-3 w-3 text-[#DD700B]" />
            <span>Statutory Security Gateway</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">Institutional Login</h2>
          <p className="text-xs text-[#D9DADF] mt-0.5 font-medium">
            Single Sign-On for College Authorities, NGOs & Corporates
          </p>
        </div>
        <div className="h-11 w-11 rounded-2xl bg-[#1C1D1A] border-2 border-[#FCF8D8] flex items-center justify-center text-[#DD700B] shrink-0 shadow-[2px_2px_0px_0px_#FCF8D8]">
          <Lock className="h-5 w-5" />
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Error & Lockout Alert */}
        {errorMessage && (
          <div
            className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border-2 border-[#1C1D1A] ${
              remainingLockout > 0
                ? 'bg-[#DD700B] text-white shadow-[2px_2px_0px_0px_#1C1D1A]'
                : 'bg-[#FCF8D8] text-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]'
            }`}
          >
            {remainingLockout > 0 ? (
              <Clock className="h-4 w-4 shrink-0 mt-0.5 animate-pulse" />
            ) : (
              <AlertCircle className="h-4 w-4 text-[#DD700B] shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <p className="font-display font-extrabold">
                {remainingLockout > 0
                  ? `Account Temporarily Locked (${remainingLockout}s)`
                  : 'Authentication Notice'}
              </p>
              <p className="font-medium leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-display font-extrabold text-[#1C1D1A] flex items-center justify-between">
              <span>Institutional Email Address</span>
              <span className="text-[10px] text-[#7C7D75] font-mono">gov.in / org / corporate</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7D75]">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="e.g. dean.admin@college.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || remainingLockout > 0}
                className="w-full pl-10 pr-3.5 text-xs sm:text-sm h-11 bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] rounded-2xl font-semibold text-[#1C1D1A] placeholder:text-[#7C7D75] focus:outline-hidden focus:border-[#DD700B]"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-display font-extrabold text-[#1C1D1A]">
                Password
              </label>
              <span className="text-[10px] text-[#7C7D75] font-semibold">Min. 8 characters</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7D75]">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting || remainingLockout > 0}
                className="w-full pl-10 pr-10 text-xs sm:text-sm h-11 bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] rounded-2xl font-semibold text-[#1C1D1A] placeholder:text-[#7C7D75] focus:outline-hidden focus:border-[#DD700B]"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7C7D75] hover:text-[#1C1D1A] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="pt-1.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#7C7D75] font-bold">Password Strength:</span>
                  <span className="font-extrabold text-[#DD700B]">
                    {strength.label}
                  </span>
                </div>
                <div className="h-2 w-full bg-[#D9DADF] rounded-full overflow-hidden flex gap-1 border border-[#1C1D1A]">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 transition-all duration-300 ${
                        strength.score >= step ? 'bg-[#DD700B]' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                {/* Requirements Checklist */}
                <div className="grid grid-cols-2 gap-1 text-[10px] text-[#7C7D75] font-semibold pt-0.5">
                  <span className={strength.hasMinLength ? 'text-[#1C1D1A] font-bold' : ''}>
                    {strength.hasMinLength ? '✓' : '•'} 8+ chars
                  </span>
                  <span className={strength.hasUppercase && strength.hasLowercase ? 'text-[#1C1D1A] font-bold' : ''}>
                    {strength.hasUppercase && strength.hasLowercase ? '✓' : '•'} Upper & lower
                  </span>
                  <span className={strength.hasNumber ? 'text-[#1C1D1A] font-bold' : ''}>
                    {strength.hasNumber ? '✓' : '•'} 1+ number
                  </span>
                  <span className={strength.hasSpecial ? 'text-[#1C1D1A] font-bold' : ''}>
                    {strength.hasSpecial ? '✓' : '•'} 1+ special char
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || remainingLockout > 0}
            className="w-full bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-sm py-3 px-5 rounded-2xl border-2 border-[#1C1D1A] shadow-[3px_3px_0px_0px_#1C1D1A] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : remainingLockout > 0 ? (
              <>
                <Clock className="h-4 w-4" />
                <span>Locked ({remainingLockout}s)</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Authenticate & Enter Dean Portal</span>
              </>
            )}
          </button>
        </form>

        {/* Quick-Test / Evaluator Account Selector */}
        <div className="pt-2 border-t-2 border-[#1C1D1A]/15 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-display font-extrabold text-[#1C1D1A]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[#DD700B]" />
              Quick Evaluation Accounts (1-Click Fill)
            </span>
            <span className="text-[10px] text-[#7C7D75]">Click to Load</span>
          </div>

          <div className="space-y-1.5">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = email === acc.email;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  className={`w-full text-left p-2.5 rounded-2xl border-2 border-[#1C1D1A] text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#DD700B] text-white shadow-[2px_2px_0px_0px_#1C1D1A]'
                      : 'bg-[#FCF8D8] hover:bg-[#D9DADF] text-[#1C1D1A]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-extrabold">{acc.name.split(' (')[0]}</span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md border border-[#1C1D1A] ${
                          isSelected ? 'bg-white text-[#1C1D1A]' : 'bg-[#1C1D1A] text-[#FCF8D8]'
                        }`}
                      >
                        {acc.role}
                      </span>
                    </div>
                    <p className={`text-[10px] font-mono ${isSelected ? 'text-white/80' : 'text-[#7C7D75]'}`}>{acc.email}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Link to User & Community Portal */}
        <div className="pt-3 border-t-2 border-[#1C1D1A]/15 text-center">
          <p className="text-xs text-[#7C7D75] font-semibold">
            Booking as an NGO, Community Group, or Corporate?{' '}
            <Link
              href="/user/login"
              className="font-extrabold text-[#DD700B] hover:underline underline-offset-2 ml-1 inline-flex items-center gap-1"
            >
              <span>Open User & NGO Login Portal</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
        </div>
      </div>

      {/* Statutory Security Footer */}
      <div className="bg-[#D9DADF] border-t-2 border-[#1C1D1A] px-6 py-3.5 text-center flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-[#1C1D1A] font-extrabold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-[#DD700B]" />
            256-Bit TLS Encryption
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-[#1C1D1A]" />
            Statutory Audit Logged
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <KeyRound className="h-3 w-3 text-[#DD700B]" />
            Rate-Limit Protected
          </span>
        </div>
        <p className="text-[9px] text-[#7C7D75] font-semibold">
          Authorized use only under the State College Infrastructure Oversight Guidelines.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FCF8D8] text-[#1C1D1A] font-body selection:bg-[#DD700B] selection:text-white flex flex-col justify-between">
      {/* Official Top Bar */}
      <header className="sticky top-0 z-40 bg-[#FCF8D8]/95 backdrop-blur-md border-b-2 border-[#1C1D1A] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1C1D1A] group-hover:text-[#DD700B] transition-colors">
              idlespaces.
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#DD700B] animate-pulse" />
            <span className="hidden sm:inline-block text-[10px] font-display font-bold px-2 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] uppercase tracking-wider ml-1">
              Dean Gateway
            </span>
          </Link>

          <Link href="/discover">
            <button
              type="button"
              className="bg-white hover:bg-[#D9DADF] text-[#1C1D1A] font-display font-extrabold text-xs py-2 px-3.5 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <span>View Catalog as Guest</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#DD700B]" />
            </button>
          </Link>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <React.Suspense
            fallback={
              <div className="p-8 bg-white rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] text-center space-y-3">
                <div className="h-6 w-6 border-2 border-[#1C1D1A] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-[#7C7D75]">Loading Institutional Gateway...</p>
              </div>
            }
          >
            <LoginForm />
          </React.Suspense>
        </div>
      </main>

      {/* Grounded Footer */}
      <footer className="border-t-2 border-[#1C1D1A] bg-[#FCF8D8] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-[#7C7D75]">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm text-[#1C1D1A]">idlespaces.</span>
            <span>• Ministry of Higher Education & Public Asset Stewardship</span>
          </div>
          <div className="flex items-center gap-4 text-[#1C1D1A]">
            <span>Security Standard ISO/IEC 27001</span>
            <span>•</span>
            <span>Audit Ledger</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
