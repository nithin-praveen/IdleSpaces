'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { BookingModal } from '@/components/BookingModal';
import type { Space } from '@/types/database';
import {
  ArrowUpRight,
  ShieldCheck,
  Building,
  Monitor,
  Trophy,
  Landmark,
  Lock,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  LogIn,
  LogOut,
  FileCheck2,
  Activity,
  Globe,
  Code2,
  Terminal,
  Sparkles,
  Users,
  Camera,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const FEATURED_FACILITIES: Space[] = [
  {
    id: 'f1a23456-789a-4bcd-ef01-234567890001',
    name: 'Sardar Vallabhbhai Patel Central Auditorium',
    type: 'auditorium',
    capacity: 750,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'f1a23456-789a-4bcd-ef01-234567890002',
    name: 'Dr. APJ Abdul Kalam Advanced AI & Computing Lab',
    type: 'computer_lab',
    capacity: 140,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'f1a23456-789a-4bcd-ef01-234567890003',
    name: 'Major Dhyan Chand Multi-Sport Complex',
    type: 'ground',
    capacity: 2200,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
];

export default function CleanFrozenMistHome() {
  const { user, logout, switchDemoRole } = useAuth();

  const [selectedSpace, setSelectedSpace] = React.useState<Space | null>(null);
  const [isBookingOpen, setIsBookingOpen] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'spaces' | 'rules'>('overview');
  const [liveClock, setLiveClock] = React.useState<string>('12:00:00');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveClock(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenBooking = (space: Space) => {
    setSelectedSpace(space);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FCF8D8] text-[#1C1D1A] font-body selection:bg-[#DD700B] selection:text-white">
      {/* ── TOP MARQUEE / TICKER BAR ────────────────────────────────────── */}
      <div className="w-full bg-[#DD700B] text-white overflow-hidden border-b-2 border-[#1C1D1A] py-2.5">
        <div className="animate-marquee font-display font-extrabold text-xs sm:text-sm tracking-wider uppercase whitespace-nowrap flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span>✦</span> STATUTORY ASSET ALLOCATION GATEWAY
          </span>
          <span className="flex items-center gap-2">
            <span>✦</span> 70% RESERVED COMMUNITY QUOTA FOR REGISTERED NGOS
          </span>
          <span className="flex items-center gap-2">
            <span>✦</span> IMMUTABLE AUDIT LEDGER WITH MANDATORY STATUTORY REASONS
          </span>
          <span className="flex items-center gap-2">
            <span>✦</span> ZERO ARBITRARY REJECTIONS
          </span>
          <span className="flex items-center gap-2">
            <span>✦</span> PHOTOGRAPHIC CHECK-IN & ESCROW DEPOSIT RELEASE
          </span>
          {/* Loop duplicate */}
          <span className="flex items-center gap-2">
            <span>✦</span> STATUTORY ASSET ALLOCATION GATEWAY
          </span>
          <span className="flex items-center gap-2">
            <span>✦</span> 70% RESERVED COMMUNITY QUOTA FOR REGISTERED NGOS
          </span>
          <span className="flex items-center gap-2">
            <span>✦</span> IMMUTABLE AUDIT LEDGER WITH MANDATORY STATUTORY REASONS
          </span>
          <span className="flex items-center gap-2">
            <span>✦</span> ZERO ARBITRARY REJECTIONS
          </span>
          <span className="flex items-center gap-2">
            <span>✦</span> PHOTOGRAPHIC CHECK-IN & ESCROW DEPOSIT RELEASE
          </span>
        </div>
      </div>

      {/* ── GROUNDED, UNCLUTTERED TOP NAVIGATION BAR ────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#FCF8D8]/95 backdrop-blur-md border-b-2 border-[#1C1D1A] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1C1D1A] group-hover:text-[#DD700B] transition-colors">
              spaces.
            </span>
            <span className="h-3 w-3 rounded-full bg-[#DD700B] animate-pulse" />
            <span className="hidden sm:inline-block text-[10px] font-display font-bold px-2 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] uppercase tracking-wider ml-1">
              Public Asset Portal
            </span>
          </Link>

          {/* 4 Clean Numbered Step Pills (Direct Feature Links) */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/discover">
              <div className="bg-[#DD700B] hover:bg-[#c96205] text-white px-3.5 py-2 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] text-xs font-display font-bold flex items-center gap-1.5 transition-all hover:-translate-y-0.5">
                <span className="px-1.5 py-0.2 rounded bg-black/30 text-[10px]">01</span>
                <span>Discover</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </Link>

            <Link href="/admin">
              <div className="bg-[#7C7D75] hover:bg-[#686962] text-[#FCF8D8] px-3.5 py-2 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] text-xs font-display font-bold flex items-center gap-1.5 transition-all hover:-translate-y-0.5">
                <span className="px-1.5 py-0.2 rounded bg-black/30 text-[10px]">02</span>
                <span>Dean Review</span>
                <Lock className="h-3 w-3 text-[#FCF8D8]" />
              </div>
            </Link>

            <Link href="/bookings">
              <div className="bg-[#ADACA7] hover:bg-[#999893] text-[#1C1D1A] px-3.5 py-2 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] text-xs font-display font-bold flex items-center gap-1.5 transition-all hover:-translate-y-0.5">
                <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px]">03</span>
                <span>Check-In Proof</span>
                <Camera className="h-3 w-3" />
              </div>
            </Link>

            <Link href="/user/login">
              <div className="bg-[#D9DADF] hover:bg-[#c7c9cf] text-[#1C1D1A] px-3.5 py-2 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] text-xs font-display font-bold flex items-center gap-1.5 transition-all hover:-translate-y-0.5">
                <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px]">04</span>
                <span>User Portal</span>
              </div>
            </Link>
          </nav>

          {/* User Profile / Quick Auth Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 bg-[#D9DADF] p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border-2 border-[#1C1D1A]">
                <div className="h-6 w-6 rounded-full bg-[#1C1D1A] text-[#FCF8D8] flex items-center justify-center font-bold text-[10px]">
                  {user.role === 'admin' ? 'AD' : user.role === 'ngo' ? 'NG' : 'CP'}
                </div>
                <div className="hidden sm:block text-left leading-none">
                  <span className="text-xs font-bold text-[#1C1D1A] block">{user.name.split(' ')[0]}</span>
                  <span className="text-[9px] font-extrabold uppercase text-[#7C7D75]">{user.role}</span>
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="p-1 rounded-lg hover:bg-black/10 text-[#1C1D1A] transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link href="/user/login">
                  <button
                    type="button"
                    className="bg-[#DD700B] hover:bg-[#c25e04] text-white font-display font-extrabold text-xs py-2 px-3.5 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] flex items-center gap-1.5 cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    <LogIn className="h-3.5 w-3.5 text-white" />
                    <span>USER LOGIN</span>
                  </button>
                </Link>
                <Link href="/login" className="hidden sm:block">
                  <button
                    type="button"
                    className="bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] font-display font-extrabold text-xs py-2 px-3 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#7C7D75] flex items-center gap-1.5 cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    <Lock className="h-3 w-3 text-[#DD700B]" />
                    <span>DEAN SSO</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER (CLEAR VISUAL HIERARCHY) ─────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── SECTION 1: HERO BENTO (PURPOSE & HOW IT WORKS) ─────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Hero Card (Col Span 7) - Deep Slate Mist #7C7D75 */}
          <div className="lg:col-span-7 bg-[#7C7D75] text-[#FCF8D8] p-6 sm:p-8 md:p-10 rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] flex flex-col justify-between relative overflow-hidden">
            {/* Geometric Accent Circle */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#DD700B] border-4 border-[#1C1D1A] opacity-90 pointer-events-none" />

            {/* Badges */}
            <div className="relative z-10 flex flex-wrap items-center gap-2 mb-6">
              <span className="font-display font-extrabold text-[10px] px-3 py-1 rounded-full bg-[#1C1D1A] text-[#FCF8D8] border border-[#FCF8D8]/20 uppercase tracking-wider">
                Statutory Civic Reform 2026
              </span>
              <span className="font-display font-extrabold text-[10px] px-3 py-1 rounded-full bg-[#DD700B] text-white border-2 border-[#1C1D1A] uppercase tracking-wider">
                70% Quota for Verified NGOs
              </span>
            </div>

            {/* Headline */}
            <div className="relative z-10 space-y-3 max-w-xl">
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-[1.05] text-[#FCF8D8]">
                Fair allocation of government college assets.
              </h1>
              <p className="text-sm sm:text-base font-medium text-[#D9DADF] leading-relaxed pt-1">
                Democratizing access to public college auditoriums, advanced computer labs, and multi-sport grounds for communities and non-profits with zero corruption.
              </p>
            </div>

            {/* Action Buttons & Fast Metrics */}
            <div className="relative z-10 pt-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenBooking(FEATURED_FACILITIES[0])}
                  className="bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs sm:text-sm py-3 px-5 rounded-2xl border-2 border-[#1C1D1A] shadow-[3px_3px_0px_0px_#1C1D1A] flex items-center gap-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                >
                  <span>REQUEST ASSET ALLOCATION</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>

                <Link href="/discover">
                  <button
                    type="button"
                    className="bg-[#FCF8D8] hover:bg-white text-[#1C1D1A] font-display font-extrabold text-xs sm:text-sm py-3 px-5 rounded-2xl border-2 border-[#1C1D1A] shadow-[3px_3px_0px_0px_#1C1D1A] flex items-center gap-2 transition-transform active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                  >
                    <span>BROWSE ALL FACILITIES</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                <div className="bg-[#1C1D1A]/50 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10">
                  <span className="font-display font-extrabold text-sm sm:text-base block text-[#FCF8D8]">0₹ Tariff</span>
                  <span className="text-[10px] text-[#ADACA7]">For Registered NGOs</span>
                </div>
                <div className="bg-[#1C1D1A]/50 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10">
                  <span className="font-display font-extrabold text-sm sm:text-base block text-[#DD700B]">48 Hours</span>
                  <span className="text-[10px] text-[#ADACA7]">Statutory SLA</span>
                </div>
                <div className="bg-[#1C1D1A]/50 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10">
                  <span className="font-display font-extrabold text-sm sm:text-base block text-[#FCF8D8]">100% Sealed</span>
                  <span className="text-[10px] text-[#ADACA7]">Immutable Audit Trail</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card (Col Span 5): Transparent 3-Step Lifecycle Bento */}
          <div className="lg:col-span-5 bg-[#D9DADF] p-6 sm:p-7 rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#1C1D1A]">
                <span className="font-display font-extrabold text-xl tracking-tight text-[#1C1D1A]">
                  how it works.
                </span>
                <span className="font-display font-bold text-[10px] px-2.5 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] uppercase">
                  Statutory Flow
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1C1D1A]/70 pt-2 pb-4">
                Anti-corruption lifecycle designed to eliminate bureaucratic discretion.
              </p>

              {/* Step 1, 2, 3 */}
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="p-3.5 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-xs text-[#DD700B]">STEP 01</span>
                    <span className="text-[10px] font-bold bg-[#1C1D1A] text-white px-2 py-0.2 rounded-full">
                      Civic Quota
                    </span>
                  </div>
                  <p className="font-bold text-xs text-[#1C1D1A]">Discover & Request</p>
                  <p className="text-[11px] text-[#1C1D1A]/70 leading-relaxed">
                    NGO selects dates and attaches registration or 80G tax document. Tier 1 priority is granted automatically.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-xs text-[#7C7D75]">STEP 02</span>
                    <span className="text-[10px] font-bold bg-[#7C7D75] text-[#FCF8D8] px-2 py-0.2 rounded-full">
                      Immutable Log
                    </span>
                  </div>
                  <p className="font-bold text-xs text-[#1C1D1A]">Dean Administrative Review</p>
                  <p className="text-[11px] text-[#1C1D1A]/70 leading-relaxed">
                    The College Authority must adjudicate within 48 hours. Any rejection strictly requires a mandatory gazette-backed reason.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-xs text-[#ADACA7]">STEP 03</span>
                    <span className="text-[10px] font-bold bg-[#ADACA7] text-[#1C1D1A] px-2 py-0.2 rounded-full">
                      Inspection
                    </span>
                  </div>
                  <p className="font-bold text-xs text-[#1C1D1A]">Pre & Post Photographic Proof</p>
                  <p className="text-[11px] text-[#1C1D1A]/70 leading-relaxed">
                    Upload pre-event check-in and post-event clean photos. Clean inspections trigger immediate security deposit release.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-[#1C1D1A] flex items-center justify-between text-xs font-bold text-[#1C1D1A]">
              <span>ISO 27001 Security Standard</span>
              <span className="font-mono text-[10px] bg-[#1C1D1A] text-[#FCF8D8] px-2 py-0.5 rounded">
                SEC.VERIFIED
              </span>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: THE 3 CORE APPLICATION PILLARS ───────────────────── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-[#1C1D1A]">
              explore application modules.
            </h2>
            <span className="text-xs font-bold text-[#7C7D75]">Full Feature Suite</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Discover Module */}
            <div className="bg-[#DD700B] text-white p-6 rounded-3xl border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between pb-2 border-b-2 border-white/20">
                  <Building className="h-6 w-6 text-[#FCF8D8]" />
                  <span className="font-display font-extrabold text-xs px-2 py-0.5 rounded-full bg-white text-[#1C1D1A] uppercase">
                    Step 1
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-2xl tracking-tight pt-3">
                  discover & request.
                </h3>
                <p className="text-xs text-white/90 pt-1 leading-relaxed">
                  Browse auditoriums, computer labs, and athletic grounds with live capacity checks, quota calculators, and instant booking modal.
                </p>
              </div>

              <div className="pt-4">
                <Link href="/discover" className="block">
                  <button
                    type="button"
                    className="w-full bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] font-display font-bold text-xs py-2.5 px-4 rounded-2xl border-2 border-[#1C1D1A] flex items-center justify-between transition-transform active:translate-y-0.5"
                  >
                    <span>OPEN SPACE CATALOG</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#DD700B]" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Pillar 2: Dean Review Module */}
            <div className="bg-[#7C7D75] text-[#FCF8D8] p-6 rounded-3xl border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between pb-2 border-b-2 border-[#FCF8D8]/20">
                  <ShieldCheck className="h-6 w-6 text-[#DD700B]" />
                  <span className="font-display font-extrabold text-xs px-2 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] uppercase">
                    Step 2
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-2xl tracking-tight pt-3">
                  dean audit review.
                </h3>
                <p className="text-xs text-[#D9DADF] pt-1 leading-relaxed">
                  Dean administrative console with mandatory written rationale enforcement, document preview, and security telemetry logs.
                </p>
              </div>

              <div className="pt-4">
                <Link href="/admin" className="block">
                  <button
                    type="button"
                    className="w-full bg-[#FCF8D8] hover:bg-white text-[#1C1D1A] font-display font-bold text-xs py-2.5 px-4 rounded-2xl border-2 border-[#1C1D1A] flex items-center justify-between transition-transform active:translate-y-0.5"
                  >
                    <span>INSPECT DEAN LEDGER</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#DD700B]" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Pillar 3: Proof & Inspection Module */}
            <div className="bg-[#ADACA7] text-[#1C1D1A] p-6 rounded-3xl border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-center justify-between pb-2 border-b-2 border-[#1C1D1A]/20">
                  <Camera className="h-6 w-6 text-[#1C1D1A]" />
                  <span className="font-display font-extrabold text-xs px-2 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] uppercase">
                    Step 3
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-2xl tracking-tight pt-3">
                  check-in & proof.
                </h3>
                <p className="text-xs text-[#1C1D1A]/80 pt-1 leading-relaxed">
                  Pre-event check-in timestamping and post-event clean photo submission. Protects both the college asset and the applicant's deposit.
                </p>
              </div>

              <div className="pt-4">
                <Link href="/bookings" className="block">
                  <button
                    type="button"
                    className="w-full bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] font-display font-bold text-xs py-2.5 px-4 rounded-2xl border-2 border-[#1C1D1A] flex items-center justify-between transition-transform active:translate-y-0.5"
                  >
                    <span>MY BOOKINGS & INSPECTION</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#DD700B]" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: AVAILABLE COLLEGE FACILITIES (CLEAN & INTERACTIVE) ─ */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-[#1C1D1A]">
                featured college facilities.
              </h2>
              <p className="text-xs text-[#7C7D75] font-semibold">
                Click any space to launch the verified statutory requisition dialog
              </p>
            </div>

            <Link href="/discover">
              <span className="text-xs font-display font-bold text-[#DD700B] hover:underline flex items-center gap-1">
                <span>View Full Inventory in Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_FACILITIES.map((facility, index) => {
              const styles = [
                {
                  cardBg: 'bg-[#FCF8D8]',
                  tagBg: 'bg-[#DD700B]',
                  tagText: 'text-white',
                  capacity: '750 Attendees',
                  specs: 'Dolby Atmos • 32-Ch Mixer • Green Room',
                  quota: 'Tier 1 NGO Priority (0₹ Tariff)',
                },
                {
                  cardBg: 'bg-[#D9DADF]',
                  tagBg: 'bg-[#7C7D75]',
                  tagText: 'text-[#FCF8D8]',
                  capacity: '140 Workstations',
                  specs: 'Nvidia RTX AI Nodes • 10 Gbps LAN',
                  quota: 'Tier 1 & Tier 2 STEM Programs',
                },
                {
                  cardBg: 'bg-[#FCF8D8]',
                  tagBg: 'bg-[#ADACA7]',
                  tagText: 'text-[#1C1D1A]',
                  capacity: '2,200 Attendees',
                  specs: '1,200 Lux Floodlights • BCCI Pavilion',
                  quota: 'Weekend Community Sports Quota',
                },
              ];
              const style = styles[index % styles.length];

              return (
                <div
                  key={facility.id}
                  className={`${style.cardBg} p-6 rounded-3xl border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] flex flex-col justify-between min-h-[300px] hover:-translate-y-1 transition-all`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b-2 border-[#1C1D1A]/15">
                      <span className={`text-[10px] font-display font-extrabold uppercase px-2.5 py-0.5 rounded-full ${style.tagBg} ${style.tagText}`}>
                        {facility.type.replace('_', ' ')}
                      </span>
                      <span className="font-mono text-[10px] font-bold bg-[#1C1D1A] text-white px-2 py-0.5 rounded">
                        {style.capacity}
                      </span>
                    </div>

                    <h3 className="font-display font-extrabold text-xl tracking-tight text-[#1C1D1A] leading-snug">
                      {facility.name}
                    </h3>

                    <div className="p-3 bg-white/70 rounded-2xl border border-[#1C1D1A]/20 space-y-1 text-xs">
                      <p className="font-bold text-[#1C1D1A]">{style.quota}</p>
                      <p className="text-[11px] text-[#7C7D75]">{style.specs}</p>
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(facility)}
                      className="w-full bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-bold text-xs py-3 px-4 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] flex items-center justify-between transition-transform active:translate-y-0.5 cursor-pointer"
                    >
                      <span>REQUEST ALLOCATION</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 4: HORIZONTAL SECURITY & AUDIT TELEMETRY STRIP ──────── */}
        <section className="bg-[#D9DADF] p-5 sm:p-6 rounded-3xl border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#DD700B] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display font-extrabold text-sm text-[#1C1D1A]">
                Government Asset Integrity & Anti-Corruption Framework
              </p>
              <p className="text-xs text-[#7C7D75] font-semibold">
                Real-time security telemetry active. Clock: {liveClock} IST • ISO/IEC 27001 Compliant.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#FCF8D8] text-[#1C1D1A] border border-[#1C1D1A]">
              PROXY GUARD: ACTIVE
            </span>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#7C7D75] text-[#FCF8D8] border border-[#1C1D1A]">
              RATE LIMIT: 5/15M
            </span>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#1C1D1A] text-white">
              SHA-256 SEALED
            </span>
          </div>
        </section>
      </main>

      {/* ── CLEAN FOOTER ────────────────────────────────────────────────── */}
      <footer className="mt-12 border-t-2 border-[#1C1D1A] bg-[#FCF8D8] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-[#1C1D1A]">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-base">spaces.</span>
            <span className="text-[#7C7D75]">•</span>
            <span>National College Public Asset Allocation Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-display text-[#7C7D75]">
            <Link href="/discover" className="hover:text-[#1C1D1A]">01. Discover</Link>
            <Link href="/admin" className="hover:text-[#1C1D1A]">02. Dean Review</Link>
            <Link href="/bookings" className="hover:text-[#1C1D1A]">03. Inspection Proof</Link>
            <Link href="/user/login" className="hover:text-[#1C1D1A]">04. User Login</Link>
            <Link href="/login" className="hover:text-[#1C1D1A]">05. Dean SSO</Link>
          </div>
        </div>
      </footer>

      {/* ── INTERACTIVE BOOKING MODAL ────────────────────────────────────── */}
      <BookingModal
        space={selectedSpace}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
