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
  Users,
  Building2,
  HeartHandshake,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  KeyRound,
  UserCheck,
  Briefcase,
  HelpCircle,
} from 'lucide-react';

function UserLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, user } = useAuth();

  const redirectTarget = searchParams.get('redirect') || '/discover';
  const initialMode = searchParams.get('tab') === 'register' ? 'register' : 'login';

  const [mode, setMode] = React.useState<'login' | 'register'>(initialMode);
  
  // Login fields
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  // Register fields
  const [name, setName] = React.useState('');
  const [organization, setOrganization] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [role, setRole] = React.useState<'ngo' | 'corporate'>('ngo');

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Live password strength calculation
  const strength: PasswordStrengthResult = React.useMemo(() => {
    return evaluatePasswordStrength(password);
  }, [password]);

  // Demo user accounts filter (NGO and Corporate only)
  const userDemoAccounts = React.useMemo(() => {
    return DEMO_ACCOUNTS.filter((acc) => acc.role !== 'admin');
  }, []);

  const handleQuickFill = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.plainDemoPassword);
    setMode('login');
    setErrorMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        setSuccessMessage('Authentication successful! Directing to spaces catalog...');
        setTimeout(() => {
          router.push(redirectTarget);
        }, 500);
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected security exception occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (strength.score < 2) {
      setErrorMessage('Please choose a stronger password (minimum 8 characters including letters and numbers).');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        name,
        email,
        organization,
        role,
        department: department || (role === 'ngo' ? 'Community Outreach' : 'Corporate Relations'),
        password,
      });

      if (result.success) {
        setSuccessMessage('Registration complete! Welcome to IdleSpaces. Directing to spaces catalog...');
        setTimeout(() => {
          router.push(redirectTarget);
        }, 700);
      } else {
        setErrorMessage(result.error || 'Failed to complete registration.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Portal Branding Card */}
      <div className="bg-[#FCF8D8] border-3 border-[#1C1D1A] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1C1D1A] transition-all">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between pb-5 border-b-2 border-[#1C1D1A] gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#DD700B] border-2 border-[#1C1D1A] flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#1C1D1A]">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg sm:text-xl text-[#1C1D1A]">
                  User & NGO Portal
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DD700B] text-white border border-[#1C1D1A]">
                  Tier 1 / 2
                </span>
              </div>
              <p className="text-xs text-[#7C7D75] font-medium">
                Fair public space reservation for NGOs, citizens & corporates
              </p>
            </div>
          </div>

          <Link href="/login" className="hidden sm:flex text-[11px] font-bold text-[#7C7D75] hover:text-[#1C1D1A] items-center gap-1">
            <span>Dean SSO</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Mode Toggle: Sign In vs Register */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#D9DADF] rounded-2xl border-2 border-[#1C1D1A] my-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-3 rounded-xl font-display font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'login'
                ? 'bg-[#1C1D1A] text-[#FCF8D8] shadow-[2px_2px_0px_0px_#DD700B]'
                : 'text-[#1C1D1A] hover:bg-black/10'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-3 rounded-xl font-display font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'register'
                ? 'bg-[#1C1D1A] text-[#FCF8D8] shadow-[2px_2px_0px_0px_#DD700B]'
                : 'text-[#1C1D1A] hover:bg-black/10'
            }`}
          >
            <Sparkles className="h-4 w-4 text-[#DD700B]" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-100 border-2 border-red-800 text-red-950 text-xs flex items-start gap-2.5 shadow-[2px_2px_0px_0px_#991b1b]">
            <AlertCircle className="h-4 w-4 text-red-800 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Notice:</span>
              <p className="leading-snug">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-100 border-2 border-emerald-800 text-emerald-950 text-xs flex items-start gap-2.5 shadow-[2px_2px_0px_0px_#065f46]">
            <CheckCircle2 className="h-4 w-4 text-emerald-800 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Success:</span>
              <p className="leading-snug">{successMessage}</p>
            </div>
          </div>
        )}

        {/* ── MODE 1: LOGIN FORM ────────────────────────────────────────── */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="user-login-email" className="text-xs font-bold text-[#1C1D1A]">
                Organization / Applicant Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7D75]">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="user-login-email"
                  type="email"
                  required
                  placeholder="contact@your-ngo.org or you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="pl-10 h-11 bg-white border-2 border-[#1C1D1A] rounded-xl text-xs sm:text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#DD700B]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="user-login-password" className="text-xs font-bold text-[#1C1D1A]">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => alert('For demonstration purposes, click any demo account below to fill credentials.')}
                  className="text-[10px] text-[#DD700B] hover:underline font-bold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7D75]">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="user-login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="pl-10 pr-10 h-11 bg-white border-2 border-[#1C1D1A] rounded-xl text-xs sm:text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#DD700B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7C7D75] hover:text-[#1C1D1A]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#DD700B] hover:bg-[#c25e04] text-white border-2 border-[#1C1D1A] rounded-2xl font-display font-extrabold text-sm shadow-[3px_3px_0px_0px_#1C1D1A] transition-all hover:-translate-y-0.5 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In as Applicant</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        ) : (
          /* ── MODE 2: REGISTRATION FORM ────────────────────────────────── */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#1C1D1A] flex items-center justify-between">
                <span>Select Entity Classification</span>
                <span className="text-[10px] text-[#7C7D75]">Gov College Allocation Tier</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('ngo')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    role === 'ngo'
                      ? 'bg-amber-100 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#DD700B]'
                      : 'bg-white border-slate-300 hover:border-[#1C1D1A]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1D1A]">
                    <HeartHandshake className="h-4 w-4 text-[#DD700B]" />
                    <span>Tier 1: NGO / Trust</span>
                  </div>
                  <p className="text-[10px] text-[#7C7D75] mt-1">
                    70% Reserved Quota • Free/Subsidized Access
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('corporate')}
                  className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    role === 'corporate'
                      ? 'bg-blue-100 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]'
                      : 'bg-white border-slate-300 hover:border-[#1C1D1A]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1D1A]">
                    <Building2 className="h-4 w-4 text-blue-800" />
                    <span>Tier 2: Corporate</span>
                  </div>
                  <p className="text-[10px] text-[#7C7D75] mt-1">
                    Standard Commercial Quota • Lease Rates
                  </p>
                </button>
              </div>
            </div>

            {/* Representative Name */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-name" className="text-xs font-bold text-[#1C1D1A]">
                Representative / Nodal Officer Name
              </Label>
              <Input
                id="reg-name"
                required
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="h-10 bg-white border-2 border-[#1C1D1A] rounded-xl text-xs sm:text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#DD700B]"
              />
            </div>

            {/* Organization Name */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-org" className="text-xs font-bold text-[#1C1D1A]">
                Organization / Community Entity Name
              </Label>
              <Input
                id="reg-org"
                required
                placeholder="e.g. Vidya Shiksha Foundation"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                disabled={isSubmitting}
                className="h-10 bg-white border-2 border-[#1C1D1A] rounded-xl text-xs sm:text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#DD700B]"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-email" className="text-xs font-bold text-[#1C1D1A]">
                Official Email Address
              </Label>
              <Input
                id="reg-email"
                type="email"
                required
                placeholder="nodal.contact@organization.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="h-10 bg-white border-2 border-[#1C1D1A] rounded-xl text-xs sm:text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#DD700B]"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="reg-password" className="text-xs font-bold text-[#1C1D1A] flex items-center justify-between">
                <span>Account Password</span>
                <span className="text-[10px] text-[#7C7D75]">Min. 8 characters</span>
              </Label>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="pr-10 h-10 bg-white border-2 border-[#1C1D1A] rounded-xl text-xs sm:text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#DD700B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7C7D75] hover:text-[#1C1D1A]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {password.length > 0 && (
                <div className="pt-1 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#7C7D75]">Strength:</span>
                    <span className="font-bold text-[#1C1D1A]">{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#D9DADF] rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 transition-all duration-300 ${
                          strength.score >= step ? strength.color : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] border-2 border-[#1C1D1A] rounded-2xl font-display font-extrabold text-sm shadow-[3px_3px_0px_0px_#DD700B] transition-all hover:-translate-y-0.5 cursor-pointer mt-3"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Registering Account...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#DD700B]" />
                  <span>Create Account & Start Booking</span>
                </div>
              )}
            </Button>
          </form>
        )}

        {/* Quick Test / Demo Accounts 1-Click Fill */}
        <div className="mt-8 pt-6 border-t-2 border-[#1C1D1A]/20">
          <div className="flex items-center justify-between text-xs font-bold text-[#1C1D1A] mb-3">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#DD700B]" />
              <span>1-Click Demo User Accounts:</span>
            </span>
            <span className="text-[10px] text-[#7C7D75]">Instant Evaluation</span>
          </div>

          <div className="space-y-2">
            {userDemoAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleQuickFill(acc)}
                className="w-full text-left p-3 rounded-2xl bg-white hover:bg-[#D9DADF]/40 border-2 border-[#1C1D1A] transition-all flex items-center justify-between cursor-pointer group shadow-[2px_2px_0px_0px_#1C1D1A] hover:translate-x-0.5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#1C1D1A] group-hover:text-[#DD700B]">
                      {acc.name.split(' (')[0]}
                    </span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border ${
                      acc.role === 'ngo'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-blue-100 text-blue-900 border-blue-300'
                    }`}>
                      {acc.role.toUpperCase()} • TIER {acc.tier}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7C7D75] font-mono mt-0.5">
                    {acc.email}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#7C7D75] group-hover:text-[#DD700B] group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Switch to Admin SSO */}
        <div className="mt-6 pt-5 border-t-2 border-[#1C1D1A]/10 text-center">
          <p className="text-xs text-[#7C7D75]">
            College Authority or Administrator?{' '}
            <Link
              href="/login?tab=admin"
              className="font-bold text-[#1C1D1A] hover:text-[#DD700B] underline underline-offset-2 ml-1"
            >
              Go to Institutional Dean SSO
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UserLoginPage() {
  return (
    <div className="min-h-screen bg-[#FCF8D8] text-[#1C1D1A] flex flex-col justify-between selection:bg-[#DD700B] selection:text-white">
      {/* Top Header */}
      <header className="border-b-2 border-[#1C1D1A] bg-[#FCF8D8]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display font-extrabold text-2xl tracking-tight text-[#1C1D1A] group-hover:text-[#DD700B] transition-colors">
              spaces.
            </span>
            <span className="h-2 w-2 rounded-full bg-[#DD700B] animate-pulse" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] uppercase tracking-wider">
              User Portal
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/discover">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-bold border-2 border-[#1C1D1A] bg-white hover:bg-[#D9DADF] rounded-xl gap-1.5 shadow-[2px_2px_0px_0px_#1C1D1A]"
              >
                <span>Browse Spaces</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="sm"
                className="text-xs font-bold border-2 border-[#1C1D1A] bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] rounded-xl gap-1.5 shadow-[2px_2px_0px_0px_#DD700B]"
              >
                <Lock className="h-3.5 w-3.5 text-[#DD700B]" />
                <span className="hidden sm:inline">Dean Admin SSO</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <React.Suspense
          fallback={
            <div className="p-8 bg-white border-2 border-[#1C1D1A] rounded-3xl shadow-[4px_4px_0px_0px_#1C1D1A] text-center space-y-3">
              <div className="h-6 w-6 border-2 border-[#DD700B] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-[#7C7D75]">Loading User Gateway...</p>
            </div>
          }
        >
          <UserLoginForm />
        </React.Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#1C1D1A] bg-[#FCF8D8] py-4 text-xs text-[#7C7D75]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 IdleSpaces • Fair Allocation for Public College Infrastructure</p>
          <div className="flex items-center gap-4 text-[11px] font-bold">
            <Link href="/discover" className="hover:text-[#1C1D1A]">Public Catalog</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-[#1C1D1A]">Authority Gateway</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
