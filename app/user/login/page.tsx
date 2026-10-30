'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  evaluatePasswordStrength,
  DEMO_ACCOUNTS,
  type PasswordStrengthResult,
} from '@/lib/auth-client';
import { loginWithDemoAccountAction } from '@/app/auth-actions';
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
  UserCheck,
  ArrowUpRight,
  KeyRound,
} from 'lucide-react';

function UserLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register } = useAuth();

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

  const strength: PasswordStrengthResult = React.useMemo(() => {
    return evaluatePasswordStrength(password);
  }, [password]);

  const userDemoAccounts = React.useMemo(() => {
    return DEMO_ACCOUNTS.filter((acc) => acc.role !== 'admin');
  }, []);

  const handleQuickFill = async (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword('••••••••••••');
    setMode('login');
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const res = await loginWithDemoAccountAction(acc.id);
      if (res.success) {
        setSuccessMessage('Authentication successful! Directing to spaces catalog...');
        setTimeout(() => {
          router.push(redirectTarget);
        }, 500);
      } else {
        setErrorMessage(res.error || 'Authentication failed.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="bg-white border-2 border-[#1C1D1A] rounded-3xl shadow-[5px_5px_0px_0px_#1C1D1A] overflow-hidden transition-all">
        {/* Portal Switcher Banner */}
        <div className="grid grid-cols-2 text-xs font-display font-extrabold border-b-2 border-[#1C1D1A]">
          <div className="flex items-center justify-center gap-1.5 py-3 px-3 bg-[#1C1D1A] text-[#FCF8D8] text-center border-r-2 border-[#1C1D1A]">
            <Users className="h-3.5 w-3.5 text-[#DD700B]" />
            <span>👥 NGO/Societal & Private Portal</span>
          </div>
          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 py-3 px-3 bg-[#FCF8D8] text-[#1C1D1A] hover:bg-[#D9DADF] transition-colors text-center cursor-pointer"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#7C7D75]" />
            <span>🏛️ Dean SSO</span>
          </Link>
        </div>

        {/* Header Ribbon */}
        <div className="bg-[#FCF8D8] px-6 py-5 border-b-2 border-[#1C1D1A] flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DD700B] text-white text-[10px] font-display font-extrabold uppercase tracking-wider mb-1.5 border border-[#1C1D1A]">
              <span>Tier 1 / Tier 2 Allocation</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl text-[#1C1D1A] tracking-tight">
              User & Community Portal
            </h1>
            <p className="text-xs text-[#7C7D75] mt-0.5 font-semibold">
              Fair space reservation for verified NGOs/societal groups & private entities
            </p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-[#DD700B] border-2 border-[#1C1D1A] flex items-center justify-center text-white shrink-0 shadow-[2px_2px_0px_0px_#1C1D1A]">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="p-6 sm:p-7 space-y-5">
          {/* Mode Toggle: Sign In vs Register */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#D9DADF] rounded-2xl border-2 border-[#1C1D1A]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl font-display font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
              className={`py-2 px-3 rounded-xl font-display font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
            <div className="p-3.5 rounded-2xl bg-[#DD700B] text-white border-2 border-[#1C1D1A] text-xs flex items-start gap-2.5 shadow-[2px_2px_0px_0px_#1C1D1A]">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-display font-extrabold">Notice:</span>
                <p className="leading-snug font-medium">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-[#FCF8D8] text-[#1C1D1A] border-2 border-[#1C1D1A] text-xs flex items-start gap-2.5 shadow-[2px_2px_0px_0px_#1C1D1A]">
              <CheckCircle2 className="h-4 w-4 text-[#DD700B] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-display font-extrabold">Success:</span>
                <p className="leading-snug font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {/* ── MODE 1: LOGIN FORM ────────────────────────────────────────── */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="user-login-email" className="text-xs font-display font-extrabold text-[#1C1D1A] block">
                  Organization / Applicant Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7D75]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="user-login-email"
                    type="email"
                    required
                    placeholder="contact@your-ngo.org or you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-3.5 h-11 bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] rounded-2xl text-xs sm:text-sm font-semibold text-[#1C1D1A] placeholder:text-[#7C7D75] focus:outline-hidden focus:border-[#DD700B]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="user-login-password" className="text-xs font-display font-extrabold text-[#1C1D1A]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('For demonstration purposes, click any demo account below to fill credentials.')}
                    className="text-[10px] text-[#DD700B] hover:underline font-extrabold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7C7D75]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="user-login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-10 h-11 bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] rounded-2xl text-xs sm:text-sm font-semibold text-[#1C1D1A] placeholder:text-[#7C7D75] focus:outline-hidden focus:border-[#DD700B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7C7D75] hover:text-[#1C1D1A] cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#DD700B] hover:bg-[#c96205] text-white border-2 border-[#1C1D1A] rounded-2xl font-display font-extrabold text-sm shadow-[3px_3px_0px_0px_#1C1D1A] transition-all hover:-translate-y-0.5 cursor-pointer mt-2 flex items-center justify-center gap-2"
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
              </button>
            </form>
          ) : (
            /* ── MODE 2: REGISTRATION FORM ────────────────────────────────── */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-display font-extrabold text-[#1C1D1A] flex items-center justify-between">
                  <span>Select Entity Classification</span>
                  <span className="text-[10px] text-[#7C7D75] font-mono">Allocation Tier</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole('ngo')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      role === 'ngo'
                        ? 'bg-[#FCF8D8] border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]'
                        : 'bg-white border-[#1C1D1A]/30 hover:border-[#1C1D1A]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-display font-extrabold text-[#1C1D1A]">
                      <HeartHandshake className="h-4 w-4 text-[#DD700B]" />
                      <span>Tier 1: NGO / Societal</span>
                    </div>
                    <p className="text-[10px] text-[#7C7D75] mt-1 font-semibold leading-tight">
                      70% Quota • Subsidized Access
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('corporate')}
                    className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      role === 'corporate'
                        ? 'bg-[#D9DADF] border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]'
                        : 'bg-white border-[#1C1D1A]/30 hover:border-[#1C1D1A]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-display font-extrabold text-[#1C1D1A]">
                      <Building2 className="h-4 w-4 text-[#7C7D75]" />
                      <span>Tier 2: Private</span>
                    </div>
                    <p className="text-[10px] text-[#7C7D75] mt-1 font-semibold leading-tight">
                      Standard Private / Commercial Quota
                    </p>
                  </button>
                </div>
              </div>

              {/* Representative Name */}
              <div className="space-y-1">
                <label htmlFor="reg-name" className="text-xs font-display font-extrabold text-[#1C1D1A] block">
                  Representative / Nodal Officer Name
                </label>
                <input
                  id="reg-name"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3.5 h-11 bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] rounded-2xl text-xs sm:text-sm font-semibold text-[#1C1D1A] focus:outline-hidden focus:border-[#DD700B]"
                />
              </div>

              {/* Organization Name */}
              <div className="space-y-1">
                <label htmlFor="reg-org" className="text-xs font-display font-extrabold text-[#1C1D1A] block">
                  Organization / Entity Name
                </label>
                <input
                  id="reg-org"
                  required
                  placeholder="e.g. Vidya Shiksha Foundation"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3.5 h-11 bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] rounded-2xl text-xs sm:text-sm font-semibold text-[#1C1D1A] focus:outline-hidden focus:border-[#DD700B]"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label htmlFor="reg-email" className="text-xs font-display font-extrabold text-[#1C1D1A] block">
                  Official Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="nodal.contact@organization.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3.5 h-11 bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] rounded-2xl text-xs sm:text-sm font-semibold text-[#1C1D1A] focus:outline-hidden focus:border-[#DD700B]"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="reg-password" className="text-xs font-display font-extrabold text-[#1C1D1A]">
                    Account Password
                  </label>
                  <span className="text-[10px] text-[#7C7D75] font-semibold">Min. 8 characters</span>
                </div>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3.5 pr-10 h-11 bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] rounded-2xl text-xs sm:text-sm font-semibold text-[#1C1D1A] focus:outline-hidden focus:border-[#DD700B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7C7D75] hover:text-[#1C1D1A] cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#DD700B] hover:bg-[#c96205] text-white border-2 border-[#1C1D1A] rounded-2xl font-display font-extrabold text-sm shadow-[3px_3px_0px_0px_#1C1D1A] transition-all hover:-translate-y-0.5 cursor-pointer mt-3 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Registering Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-white" />
                    <span>Create Account & Start Booking</span>
                  </div>
                )}
              </button>
            </form>
          )}

          {/* Quick Test / Demo Accounts 1-Click Fill */}
          <div className="pt-5 border-t-2 border-[#1C1D1A]/15 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-display font-extrabold text-[#1C1D1A]">
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
                  className="w-full text-left p-3 rounded-2xl bg-[#FCF8D8] hover:bg-[#D9DADF] border-2 border-[#1C1D1A] transition-all flex items-center justify-between cursor-pointer group shadow-[2px_2px_0px_0px_#1C1D1A] hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-xs text-[#1C1D1A] group-hover:text-[#DD700B]">
                        {acc.name.split(' (')[0]}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-[#1C1D1A] text-[#FCF8D8] border border-[#1C1D1A]">
                        {acc.role === 'corporate' ? 'PRIVATE' : 'NGO/SOCIETAL'} • TIER {acc.tier}
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
        </div>

        {/* Footer Bar */}
        <div className="bg-[#D9DADF] border-t-2 border-[#1C1D1A] px-6 py-3.5 text-center flex items-center justify-between text-xs font-bold text-[#1C1D1A]">
          <span>Security Standard ISO 27001</span>
          <Link
            href="/login"
            className="font-extrabold text-[#DD700B] hover:underline flex items-center gap-1"
          >
            <span>Authority Login</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
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
              idlespaces.
            </span>
            <span className="h-2 w-2 rounded-full bg-[#DD700B] animate-pulse" />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] uppercase tracking-wider">
              User Portal
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/discover">
              <button
                type="button"
                className="text-xs font-display font-extrabold border-2 border-[#1C1D1A] bg-white hover:bg-[#D9DADF] text-[#1C1D1A] rounded-2xl px-3.5 py-2 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#1C1D1A] cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <span>Browse Spaces</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#DD700B]" />
              </button>
            </Link>

            <Link href="/login">
              <button
                type="button"
                className="text-xs font-display font-extrabold border-2 border-[#1C1D1A] bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] rounded-2xl px-3.5 py-2 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#DD700B] cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <Lock className="h-3.5 w-3.5 text-[#DD700B]" />
                <span className="hidden sm:inline">Dean Admin SSO</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <React.Suspense
          fallback={
            <div className="p-8 bg-white border-2 border-[#1C1D1A] rounded-3xl shadow-[5px_5px_0px_0px_#1C1D1A] text-center space-y-3">
              <div className="h-6 w-6 border-2 border-[#DD700B] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-[#7C7D75]">Loading User Gateway...</p>
            </div>
          }
        >
          <UserLoginForm />
        </React.Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#1C1D1A] bg-[#FCF8D8] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-[#7C7D75]">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm text-[#1C1D1A]">idlespaces.</span>
            <span>• Fair Access & Institutional Asset Sharing Network</span>
          </div>
          <div className="flex items-center gap-4 text-[#1C1D1A]">
            <Link href="/discover" className="hover:text-[#DD700B]">Public Catalog</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-[#DD700B]">Authority Gateway</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
