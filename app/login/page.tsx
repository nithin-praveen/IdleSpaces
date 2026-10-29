'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import {
  evaluatePasswordStrength,
  DEMO_ACCOUNTS,
  type PasswordStrengthResult,
} from '@/lib/auth';
import { useAuth } from '@/components/AuthProvider';
import {
  Landmark,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  KeyRound,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user } = useAuth();

  const redirectTarget = searchParams.get('redirect') || (user?.role === 'admin' ? '/admin' : '/discover');
  const errorParam = searchParams.get('error');

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [remainingLockout, setRemainingLockout] = React.useState<number>(0);

  // Live password strength calculation
  const strength: PasswordStrengthResult = React.useMemo(() => {
    return evaluatePasswordStrength(password);
  }, [password]);

  // Handle URL errors on load (e.g. from Proxy guard)
  React.useEffect(() => {
    if (errorParam === 'admin_required') {
      setErrorMessage("Access Denied: The Dean's Audit Review requires verified Institutional Administrator privileges. Please authenticate as Admin.");
    } else if (errorParam === 'login_required') {
      setErrorMessage('Authentication Required: Please sign in with your verified institutional account to continue.');
    }
  }, [errorParam]);

  // Lockout countdown timer
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
        router.push(redirectTarget);
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

  const handleQuickFill = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.plainDemoPassword);
    setErrorMessage(null);
  };

  return (
    <Card className="border-slate-300 shadow-xl bg-white overflow-hidden rounded-2xl">
      {/* Portal Switcher Banner */}
      <div className="bg-slate-100 p-2 border-b border-slate-200 grid grid-cols-2 gap-1.5 text-xs font-semibold">
        <Link
          href="/user/login"
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-white transition-all text-center"
        >
          <span>👥 User & NGO Portal</span>
        </Link>
        <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-900 text-white shadow-xs text-center font-bold">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
          <span>🏛️ Dean / Admin SSO</span>
        </div>
      </div>

      {/* Header with Security Ribbon */}
      <div className="bg-blue-900 px-6 py-5 text-white flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-800 text-blue-100 text-[10px] font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-300" />
            <span>Statutory Security Gateway</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Institutional Login</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Single Sign-On for College Authorities, NGOs & Corporates
          </p>
        </div>
        <div className="h-12 w-12 rounded-full bg-blue-800/80 border border-blue-700/60 flex items-center justify-center text-blue-200 shrink-0">
          <Lock className="h-6 w-6" />
        </div>
      </div>

      <CardContent className="p-6 space-y-5">
        {/* Error & Lockout Alert */}
        {errorMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
              remainingLockout > 0
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            {remainingLockout > 0 ? (
              <Clock className="h-4 w-4 text-red-600 shrink-0 mt-0.5 animate-pulse" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-semibold">
                {remainingLockout > 0
                  ? `Account Temporarily Locked (${remainingLockout}s)`
                  : 'Authentication Notice'}
              </p>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Institutional Email Address</span>
              <span className="text-[10px] text-slate-400 font-normal">gov.in / org / corporate</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <Input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="e.g. dean.admin@college.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || remainingLockout > 0}
                className="pl-9 text-xs sm:text-sm h-10 border-slate-300 focus:border-blue-900 focus:ring-blue-900"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                Password
              </Label>
              <span className="text-[10px] text-slate-400">Min. 8 characters</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting || remainingLockout > 0}
                className="pl-9 pr-10 text-xs sm:text-sm h-10 border-slate-300 focus:border-blue-900 focus:ring-blue-900"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-hidden"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="pt-1.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Password Strength:</span>
                  <span
                    className={`font-bold ${
                      strength.score >= 3
                        ? 'text-emerald-700'
                        : strength.score === 2
                        ? 'text-amber-700'
                        : 'text-red-700'
                    }`}
                  >
                    {strength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 transition-all duration-300 ${
                        strength.score >= step ? strength.color : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
                {/* Password Requirements Checklist */}
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-0.5">
                  <span className={`flex items-center gap-1 ${strength.hasMinLength ? 'text-emerald-700 font-semibold' : ''}`}>
                    {strength.hasMinLength ? '✓' : '•'} 8+ chars
                  </span>
                  <span className={`flex items-center gap-1 ${strength.hasUppercase && strength.hasLowercase ? 'text-emerald-700 font-semibold' : ''}`}>
                    {strength.hasUppercase && strength.hasLowercase ? '✓' : '•'} Upper & lower
                  </span>
                  <span className={`flex items-center gap-1 ${strength.hasNumber ? 'text-emerald-700 font-semibold' : ''}`}>
                    {strength.hasNumber ? '✓' : '•'} 1+ number
                  </span>
                  <span className={`flex items-center gap-1 ${strength.hasSpecial ? 'text-emerald-700 font-semibold' : ''}`}>
                    {strength.hasSpecial ? '✓' : '•'} 1+ special char
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || remainingLockout > 0}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 h-11 text-xs sm:text-sm rounded-xl shadow-md transition-all gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying Credentials & Session...</span>
              </>
            ) : remainingLockout > 0 ? (
              <>
                <Clock className="h-4 w-4 text-red-300" />
                <span>Locked ({remainingLockout}s)</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 text-blue-200" />
                <span>Authenticate & Enter Portal</span>
              </>
            )}
          </Button>
        </form>

        {/* Quick-Test / Evaluator Account Selector */}
        <div className="pt-2 border-t border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-700" />
              Quick Evaluation Accounts (1-Click Fill)
            </span>
            <span className="text-[10px] text-blue-900 font-medium">Click to Load</span>
          </div>

          <div className="space-y-1.5">
            {DEMO_ACCOUNTS.map((acc) => {
              const isSelected = email === acc.email;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-400 ring-1 ring-blue-300'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">{acc.name.split(' (')[0]}</span>
                      <Badge
                        variant={acc.role === 'admin' ? 'gov' : acc.role === 'ngo' ? 'success' : 'outline'}
                        className="text-[9px] uppercase font-bold px-1.5 py-0"
                      >
                        {acc.role}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">{acc.email}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Link to User & Community Portal */}
        <div className="pt-3 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-600">
            Booking as an NGO, Community Group, or Corporate?{' '}
            <Link
              href="/user/login"
              className="font-bold text-blue-900 hover:text-blue-700 underline underline-offset-2 ml-1 inline-flex items-center gap-1"
            >
              <span>Open User & NGO Login Portal</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
        </div>
      </CardContent>

      {/* Statutory Security Footer */}
      <CardFooter className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 text-center flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            256-Bit TLS Encryption
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-blue-600" />
            Statutory Audit Logged
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <KeyRound className="h-3 w-3 text-amber-600" />
            Rate-Limit Protected
          </span>
        </div>
        <p className="text-[9px] text-slate-400">
          Authorized use only under the State College Infrastructure Oversight Guidelines.
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 flex flex-col justify-between font-sans">
      {/* Official Government Top Bar */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-blue-900 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-800 transition-colors">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-900 tracking-tight">IdleSpaces</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 uppercase tracking-wider">
                  Gov Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                National Public Asset Allocation & Anti-Corruption Ledger
              </p>
            </div>
          </Link>

          <Link href="/discover">
            <Button variant="ghost" size="sm" className="text-xs text-slate-600 gap-1.5">
              <span>View Catalog as Guest</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Authentication Card wrapped in Suspense */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          <React.Suspense
            fallback={
              <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-lg text-center space-y-3">
                <div className="h-6 w-6 border-2 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500">Loading Secure Institutional Gateway...</p>
              </div>
            }
          >
            <LoginForm />
          </React.Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 IdleSpaces Platform • Ministry of Higher Education & Public Asset Stewardship</p>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>Security Standard ISO/IEC 27001</span>
            <span>Privacy Policy</span>
            <span>Audit Ledger</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
