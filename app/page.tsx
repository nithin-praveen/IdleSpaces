'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { BookingModal } from '@/components/BookingModal';
import { ListSpaceModal } from '@/components/ListSpaceModal';
import type { Space } from '@/types/database';
import {
  ArrowUpRight,
  ShieldCheck,
  Building,
  Lock,
  CalendarCheck2,
  Clock,
  ArrowRight,
  LogIn,
  LogOut,
  Camera,
  Plus,
  Search,
  Sparkles,
  Users,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Cpu,
  FlaskConical,
  Activity,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
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

export default function CalmIdleSpacesHome() {
  const { user, logout } = useAuth();
  const [selectedSpace, setSelectedSpace] = React.useState<Space | null>(null);
  const [isBookingOpen, setIsBookingOpen] = React.useState<boolean>(false);
  const [isListModalOpen, setIsListModalOpen] = React.useState<boolean>(false);

  const handleOpenBooking = (space: Space) => {
    setSelectedSpace(space);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FCF8D8] text-[#1C1D1A] font-body selection:bg-[#DD700B] selection:text-white flex flex-col justify-between">
      {/* ── TOP NAVIGATION BAR (CLEAN & SEPARATE ROUTE LINKS) ─────────────── */}
      <header className="sticky top-0 z-40 bg-[#FCF8D8]/95 backdrop-blur-md border-b-2 border-[#1C1D1A] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand Mark */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1C1D1A] group-hover:text-[#DD700B] transition-colors">
              idlespaces.
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#DD700B] animate-pulse" />
          </Link>

          {/* Navigation to Separate Pages */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-display font-bold text-[#1C1D1A]">
            <Link
              href="/discover"
              className="hover:text-[#DD700B] transition-colors py-1 flex items-center gap-1"
            >
              <span>Explore Spaces</span>
              <ArrowUpRight className="h-3 w-3 text-[#DD700B]" />
            </Link>

            <Link
              href="/how-it-works"
              className="hover:text-[#DD700B] transition-colors py-1"
            >
              How It Works
            </Link>

            <Link
              href="/about"
              className="hover:text-[#DD700B] transition-colors py-1"
            >
              About
            </Link>
          </nav>

          {/* Top Right: User Login & Dean SSO */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 bg-[#D9DADF] p-1 sm:px-3 sm:py-1 rounded-2xl border-2 border-[#1C1D1A]">
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

      {/* ── CALM & RELAXED HERO SECTION ─────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-24 flex-1">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Clean Editorial Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1C1D1A] tracking-tight leading-[1.05]">
              Unlock <br className="hidden sm:inline" />
              underused spaces <br className="hidden sm:inline" />
              & equipment.
            </h1>

            <p className="text-base sm:text-lg text-[#1C1D1A]/85 font-medium leading-relaxed max-w-xl">
              A trusted, auditable sharing network connecting institutions, makerspaces, and research universities to share idle labs, CNCs, cleanrooms, and testing facilities without friction or risk.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/discover">
                <button
                  type="button"
                  className="bg-[#DD700B] hover:bg-[#c25e04] text-white font-display font-extrabold text-sm py-3 px-5 rounded-2xl border-2 border-[#1C1D1A] shadow-[3px_3px_0px_0px_#1C1D1A] flex items-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  <span>Explore Available Assets</span>
                </button>
              </Link>

              <button
                type="button"
                onClick={() => setIsListModalOpen(true)}
                className="bg-white hover:bg-[#D9DADF] text-[#1C1D1A] font-display font-extrabold text-sm py-3 px-5 rounded-2xl border-2 border-[#1C1D1A] shadow-[3px_3px_0px_0px_#1C1D1A] flex items-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>List Idle Facility</span>
                <Plus className="h-4 w-4 text-[#DD700B]" />
              </button>
            </div>

            {/* Calm Trust Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t-2 border-[#1C1D1A]/15 max-w-lg">
              <div>
                <span className="font-display font-extrabold text-xl sm:text-2xl text-[#1C1D1A] block">70%</span>
                <span className="text-[11px] text-[#7C7D75] font-semibold">Civic Quota Reserved</span>
              </div>
              <div>
                <span className="font-display font-extrabold text-xl sm:text-2xl text-[#DD700B] block">₹0 Tariff</span>
                <span className="text-[11px] text-[#7C7D75] font-semibold">Tier 1 NGO Waiver</span>
              </div>
              <div>
                <span className="font-display font-extrabold text-xl sm:text-2xl text-[#1C1D1A] block">48 Hours</span>
                <span className="text-[11px] text-[#7C7D75] font-semibold">Statutory SLA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean doodle placed directly on the page */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <img
              src="/hero-doodle-clean.png"
              alt="Institutional Space and Equipment Sharing Network"
              className="w-full max-w-xl h-auto object-contain select-none pointer-events-none"
            />
          </div>
        </section>

        {/* ── SECTION 2: DATA ON UNUSED SPACES IN GENERAL (MACRO BENCHMARKS) ── */}
        <section className="space-y-8 pt-6 border-t-2 border-[#1C1D1A]/15">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="text-[11px] font-display font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] border border-[#1C1D1A]">
                  Infrastructure Intelligence
                </span>
                <span className="text-xs font-bold text-[#7C7D75]">
                  Public Sector Utilization Audit
                </span>
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1C1D1A] tracking-tight">
                The Anatomy of Unused Academic Spaces
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#7C7D75] font-semibold max-w-md">
              Billions of dollars in taxpayer-funded scientific labs, high-performance computing, and event infrastructure sit dormant while community innovators struggle for access.
            </p>
          </div>

          {/* 4 Big Macro Data Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-extrabold text-[#7C7D75] uppercase tracking-wider">Off-Peak Vacancy</span>
                <TrendingDown className="h-4 w-4 text-[#DD700B]" />
              </div>
              <div className="font-display font-extrabold text-4xl text-[#1C1D1A]">68%</div>
              <p className="text-xs text-[#7C7D75] font-semibold leading-relaxed">
                Of university labs, testing benches, and cleanrooms sit completely unoccupied between 5 PM and 8 AM daily and throughout 14 weeks of annual recesses.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-extrabold text-[#7C7D75] uppercase tracking-wider">Dormant Capital</span>
                <AlertTriangle className="h-4 w-4 text-[#DD700B]" />
              </div>
              <div className="font-display font-extrabold text-4xl text-[#DD700B]">₹34,000 Cr</div>
              <p className="text-xs text-[#7C7D75] font-semibold leading-relaxed">
                In specialized public equipment (5-axis CNCs, SEMs, mass spectrometers) suffers under-utilization, running at an average duty cycle of under 22%.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-extrabold text-[#7C7D75] uppercase tracking-wider">Dark Auditorium Days</span>
                <Clock className="h-4 w-4 text-[#1C1D1A]" />
              </div>
              <div className="font-display font-extrabold text-4xl text-[#1C1D1A]">210 Days</div>
              <p className="text-xs text-[#7C7D75] font-semibold leading-relaxed">
                Average annual duration a state institution auditorium remains locked, creating high maintenance overhead with zero community utility.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-extrabold text-[#7C7D75] uppercase tracking-wider">Grassroots Block</span>
                <Users className="h-4 w-4 text-[#DD700B]" />
              </div>
              <div className="font-display font-extrabold text-4xl text-[#1C1D1A]">78%</div>
              <p className="text-xs text-[#7C7D75] font-semibold leading-relaxed">
                Of youth skill NGOs, robotics clubs, and civic researchers report venue unavailability as their single largest obstacle to launching programs.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: DEEP-DIVE BY ASSET CATEGORY (UTILIZATION METERS) ──── */}
        <section className="bg-white rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] p-6 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#1C1D1A] pb-5">
            <div>
              <span className="font-display font-extrabold text-xs text-[#DD700B] uppercase tracking-wider block">
                Category Breakdown
              </span>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1C1D1A] tracking-tight">
                Where The Idle Capacity Lives
              </h3>
            </div>
            <span className="text-xs font-bold bg-[#D9DADF] text-[#1C1D1A] px-3.5 py-1.5 rounded-full border border-[#1C1D1A] self-start sm:self-auto">
              Statewide Audit Aggregate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category 1 */}
            <div className="p-6 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-white border-2 border-[#1C1D1A] flex items-center justify-center text-[#DD700B] shadow-[2px_2px_0px_0px_#1C1D1A]">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-base text-[#1C1D1A]">
                      Biotech & Testing Suites
                    </h4>
                    <p className="text-[11px] text-[#7C7D75] font-semibold">
                      Spectrometry, Centrifuges & Cleanrooms
                    </p>
                  </div>
                </div>
                <span className="font-display font-extrabold text-xl text-[#DD700B]">71% Idle</span>
              </div>

              {/* Progress Meter */}
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-white rounded-full border-2 border-[#1C1D1A] overflow-hidden flex">
                  <div className="bg-[#1C1D1A] h-full" style={{ width: '29%' }} title="Academic curriculum: 29%" />
                  <div className="bg-[#DD700B] h-full" style={{ width: '71%' }} title="Idle off-peak capacity: 71%" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#7C7D75]">
                  <span>Classroom Curriculum (29%)</span>
                  <span className="text-[#DD700B] font-extrabold">Idle Capacity (71%)</span>
                </div>
              </div>

              <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                High-containment suites and fume hoods incur ongoing 24/7 HVAC and calibration costs regardless of whether a student is present. Sharing idle hours unlocks high-tier research access for independent bio-hackers without adding overhead.
              </p>
            </div>

            {/* Category 2 */}
            <div className="p-6 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-white border-2 border-[#1C1D1A] flex items-center justify-center text-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
                    <Cpu className="h-5 w-5 text-[#DD700B]" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-base text-[#1C1D1A]">
                      AI Clusters & High-Compute Labs
                    </h4>
                    <p className="text-[11px] text-[#7C7D75] font-semibold">
                      GPU Clusters & Workstation Enclaves
                    </p>
                  </div>
                </div>
                <span className="font-display font-extrabold text-xl text-[#1C1D1A]">64% Idle</span>
              </div>

              {/* Progress Meter */}
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-white rounded-full border-2 border-[#1C1D1A] overflow-hidden flex">
                  <div className="bg-[#1C1D1A] h-full" style={{ width: '36%' }} />
                  <div className="bg-[#7C7D75] h-full" style={{ width: '64%' }} />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#7C7D75]">
                  <span>Lab Practical Classes (36%)</span>
                  <span className="text-[#1C1D1A] font-extrabold">Idle Off-Peak Capacity (64%)</span>
                </div>
              </div>

              <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                Modern engineering institutes maintain multi-core GPU clusters that sit powered-down over nights and breaks. Pooling this compute provides verified STEM non-profits and student startups with world-class machine learning infrastructure.
              </p>
            </div>

            {/* Category 3 */}
            <div className="p-6 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-white border-2 border-[#1C1D1A] flex items-center justify-center text-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
                    <Building className="h-5 w-5 text-[#DD700B]" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-base text-[#1C1D1A]">
                      Auditoriums & Central Halls
                    </h4>
                    <p className="text-[11px] text-[#7C7D75] font-semibold">
                      400-1,200 Seat Keynote Theatres
                    </p>
                  </div>
                </div>
                <span className="font-display font-extrabold text-xl text-[#1C1D1A]">58% Idle</span>
              </div>

              {/* Progress Meter */}
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-white rounded-full border-2 border-[#1C1D1A] overflow-hidden flex">
                  <div className="bg-[#1C1D1A] h-full" style={{ width: '42%' }} />
                  <div className="bg-[#ADACA7] h-full" style={{ width: '58%' }} />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#7C7D75]">
                  <span>Annual College Events (42%)</span>
                  <span className="text-[#1C1D1A] font-extrabold">Unused Dark Days (58%)</span>
                </div>
              </div>

              <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                College auditoriums are rarely scheduled outside of annual fests and convocation weekends. Releasing these venues during mid-term recesses provides civic NGOs and educational summits with dignified public space at zero tariff.
              </p>
            </div>

            {/* Category 4 */}
            <div className="p-6 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-xl bg-white border-2 border-[#1C1D1A] flex items-center justify-center text-[#DD700B] shadow-[2px_2px_0px_0px_#1C1D1A]">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-base text-[#1C1D1A]">
                      Multi-Sport Stadiums & Grounds
                    </h4>
                    <p className="text-[11px] text-[#7C7D75] font-semibold">
                      Turfs, Synthetic Tracks & Courts
                    </p>
                  </div>
                </div>
                <span className="font-display font-extrabold text-xl text-[#DD700B]">52% Idle</span>
              </div>

              {/* Progress Meter */}
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-white rounded-full border-2 border-[#1C1D1A] overflow-hidden flex">
                  <div className="bg-[#1C1D1A] h-full" style={{ width: '48%' }} />
                  <div className="bg-[#DD700B] h-full" style={{ width: '52%' }} />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#7C7D75]">
                  <span>Campus Sports (48%)</span>
                  <span className="text-[#DD700B] font-extrabold">Unbooked Community Windows (52%)</span>
                </div>
              </div>

              <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                Gated campus fields sit empty across weekends while local youth athletics leagues and disability sports organizations are forced to compete in substandard public spaces.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: THE DORMANT COST VS IDLESPACES IMPACT ─────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] text-[10px] font-display font-extrabold uppercase">
              The Status Quo Dilemma
            </div>
            <h3 className="font-display font-extrabold text-2xl text-[#1C1D1A] tracking-tight">
              The Real Cost of Dormant Infrastructure
            </h3>
            <ul className="space-y-3 text-xs text-[#1C1D1A]/85 font-semibold">
              <li className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-[#D9DADF] text-[#1C1D1A] flex items-center justify-center shrink-0 font-bold">✕</span>
                <span><strong>Mechanical Deterioration:</strong> Inactive precision laboratory instruments (CNCs, optic lasers, vacuum chambers) seize and fall out of calibration faster when idle.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-[#D9DADF] text-[#1C1D1A] flex items-center justify-center shrink-0 font-bold">✕</span>
                <span><strong>Unchecked Gatekeeping:</strong> Without statutory oversight, room allocation is governed by bureaucratic whim and informal favors rather than transparent public merit.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="h-5 w-5 rounded-full bg-[#D9DADF] text-[#1C1D1A] flex items-center justify-center shrink-0 font-bold">✕</span>
                <span><strong>Taxpayer Inefficiency:</strong> Hundreds of crores in public capital outlays produce zero civic return outside narrow classroom semester calendars.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-[#FCF8D8] border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#DD700B] text-white text-[10px] font-display font-extrabold uppercase">
              The IdleSpaces Transformation
            </div>
            <h3 className="font-display font-extrabold text-2xl text-[#1C1D1A] tracking-tight">
              The Statutory Sharing Multiplier
            </h3>
            <ul className="space-y-3 text-xs text-[#1C1D1A]/85 font-semibold">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-[#DD700B] shrink-0" />
                <span><strong>70% Protected Civic Access:</strong> Guaranteed statutory quota ensures grassroots community organizations receive priority access at ₹0 booking tariff.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-[#DD700B] shrink-0" />
                <span><strong>48-Hour SLA Adjudication:</strong> Mandates prompt institutional review with immutable gazette-backed reason logging under Section 21.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-[#DD700B] shrink-0" />
                <span><strong>Condition Proof Escrow:</strong> Digital check-in and check-out photos eliminate damage disputes and protect multi-crore equipment automatically.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── SECTION 5: LIVE FEATURED FACILITIES ──────────────────────────── */}
        <section className="space-y-6 pt-6 border-t-2 border-[#1C1D1A]/15">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="text-[11px] font-display font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#DD700B] text-white border border-[#1C1D1A]">
                  Verified Catalog
                </span>
                <span className="text-xs font-bold text-[#7C7D75]">
                  Higher Education Assets Available for Booking
                </span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1C1D1A] tracking-tight">
                Featured Available Facilities
              </h2>
            </div>

            <Link href="/discover">
              <button
                type="button"
                className="bg-white hover:bg-[#D9DADF] text-[#1C1D1A] font-display font-bold text-xs py-2 px-3.5 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_FACILITIES.map((facility, index) => {
              const bgColors = ['bg-[#FCF8D8]', 'bg-[#D9DADF]', 'bg-white'];
              const tagBg =
                index === 0
                  ? 'bg-[#DD700B] text-white'
                  : index === 1
                  ? 'bg-[#7C7D75] text-[#FCF8D8]'
                  : 'bg-[#ADACA7] text-[#1C1D1A]';

              return (
                <div
                  key={facility.id}
                  className={`${bgColors[index]} rounded-3xl border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] p-6 flex flex-col justify-between transition-all hover:-translate-y-1`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-display font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-[#1C1D1A] ${tagBg}`}>
                        {facility.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#7C7D75]">
                        #{facility.id.substring(0, 6)}
                      </span>
                    </div>

                    <h3 className="font-display font-extrabold text-xl text-[#1C1D1A] tracking-tight mb-2 leading-snug">
                      {facility.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-[#7C7D75] mb-4">
                      <Users className="h-3.5 w-3.5 text-[#DD700B]" />
                      <span className="font-bold text-[#1C1D1A]">{facility.capacity} Capacity</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-[#1C1D1A]/20 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#DD700B] block">
                        Tier 1 NGO
                      </span>
                      <span className="text-xs font-bold text-[#1C1D1A]">
                        ₹0 Fee Allocation
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenBooking(facility)}
                      className="bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] font-display font-extrabold text-xs py-2 px-3.5 rounded-xl border-2 border-[#1C1D1A] flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Book Space</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#DD700B]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 6: EXPLORE HOW IT WORKS OR ABOUT BANNER ──────────────── */}
        <section className="p-8 sm:p-10 rounded-3xl bg-[#1C1D1A] text-[#FCF8D8] border-2 border-[#1C1D1A] shadow-[6px_6px_0px_0px_#DD700B] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center lg:text-left">
            <span className="text-xs font-display font-extrabold text-[#DD700B] uppercase tracking-wider block">
              Transparent Statutory Protocol
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#FCF8D8] tracking-tight">
              Ready to See How It Works in Practice?
            </h3>
            <p className="text-xs sm:text-sm text-[#D9DADF] font-semibold leading-relaxed">
              Explore the complete 3-step statutory lifecycle, learn about the anti-corruption mandate, or browse our verified public catalogue.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link href="/how-it-works">
              <button
                type="button"
                className="bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs sm:text-sm py-3 px-5 rounded-2xl border-2 border-white shadow-[2px_2px_0px_0px_white] flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <span>Read How It Works</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>

            <Link href="/about">
              <button
                type="button"
                className="bg-[#FCF8D8] hover:bg-white text-[#1C1D1A] font-display font-extrabold text-xs sm:text-sm py-3 px-5 rounded-2xl border-2 border-white flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <span>About IdleSpaces</span>
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* ── CLEAN GROUNDED FOOTER ────────────────────────────────────────── */}
      <footer className="border-t-2 border-[#1C1D1A] bg-[#FCF8D8] py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#7C7D75]">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm text-[#1C1D1A]">idlespaces.</span>
            <span>• Fair Access & Institutional Asset Sharing Network</span>
          </div>

          <div className="flex items-center gap-4 text-[#1C1D1A]">
            <Link href="/discover" className="hover:text-[#DD700B] transition-colors">Catalog</Link>
            <Link href="/how-it-works" className="hover:text-[#DD700B] transition-colors">How It Works</Link>
            <Link href="/about" className="hover:text-[#DD700B] transition-colors">About</Link>
            <Link href="/user/login" className="hover:text-[#DD700B] transition-colors">User Portal</Link>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      <BookingModal
        space={selectedSpace}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* List Space Modal */}
      <ListSpaceModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
      />
    </div>
  );
}
