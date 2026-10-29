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
  Trophy,
  Lock,
  CalendarCheck2,
  Clock,
  MapPin,
  ArrowRight,
  LogIn,
  LogOut,
  Camera,
  Plus,
  Search,
  Sparkles,
  Users,
  CheckCircle2,
  FileText,
  Building2,
  Award,
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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8D8] text-[#1C1D1A] font-body selection:bg-[#DD700B] selection:text-white flex flex-col justify-between">
      {/* ── TOP NAVIGATION BAR (CALM & UNCLUTTERED) ───────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FCF8D8]/95 backdrop-blur-md border-b-2 border-[#1C1D1A] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand Mark */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1C1D1A] group-hover:text-[#DD700B] transition-colors">
              idlespaces.
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#DD700B] animate-pulse" />
          </Link>

          {/* Calm & Contextual Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-display font-bold text-[#1C1D1A]">
            <Link
              href="/discover"
              className="hover:text-[#DD700B] transition-colors py-1 flex items-center gap-1"
            >
              <span>Explore Spaces</span>
              <ArrowUpRight className="h-3 w-3 text-[#DD700B]" />
            </Link>

            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, 'how-it-works')}
              className="hover:text-[#DD700B] transition-colors py-1 cursor-pointer"
            >
              How It Works
            </a>

            <a
              href="#about"
              onClick={(e) => scrollToSection(e, 'about')}
              className="hover:text-[#DD700B] transition-colors py-1 cursor-pointer"
            >
              About
            </a>

            <a
              href="#featured-facilities"
              onClick={(e) => scrollToSection(e, 'featured-facilities')}
              className="hover:text-[#DD700B] transition-colors py-1 cursor-pointer"
            >
              Facilities
            </a>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20 flex-1">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Clean Editorial Typography & CTAs (No rectangular tag) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Specified Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1C1D1A] tracking-tight leading-[1.05]">
              Unlock <br className="hidden sm:inline" />
              underused spaces <br className="hidden sm:inline" />
              & equipment.
            </h1>

            {/* Specified Body Copy */}
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

        {/* ── SECTION 2: HOW THE NETWORK OPERATES (WORKFLOW STEPS + ACTIONS) ─ */}
        <section id="how-it-works" className="scroll-mt-24 space-y-6">
          <div className="bg-white rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 border-[#1C1D1A]">
              <div>
                <span className="font-display font-extrabold text-xs text-[#DD700B] uppercase tracking-wider block">
                  Statutory Accountability
                </span>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1C1D1A] tracking-tight">
                  How The Network Operates
                </h2>
              </div>
              <span className="text-xs font-bold bg-[#D9DADF] text-[#1C1D1A] px-3 py-1 rounded-full border border-[#1C1D1A] self-start sm:self-auto">
                Zero Bureaucratic Friction
              </span>
            </div>

            {/* 3 Step Bento Cards with Action Entry Points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] shadow-[3px_3px_0px_0px_#1C1D1A] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-xs px-2 py-0.5 rounded-md bg-[#1C1D1A] text-[#FCF8D8]">
                      STEP 01
                    </span>
                    <Search className="h-4 w-4 text-[#DD700B]" />
                  </div>
                  <h3 className="font-display font-extrabold text-base text-[#1C1D1A]">
                    Discover & Request
                  </h3>
                  <p className="text-xs text-[#1C1D1A]/80 leading-relaxed font-medium">
                    NGOs, community groups, and researchers browse idle slots and upload statutory registration (80G or Society NOC). Tier 1 community priority applies automatically.
                  </p>
                </div>

                <Link href="/discover">
                  <button
                    type="button"
                    className="w-full bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] font-display font-extrabold text-xs py-2 px-3 rounded-xl border-2 border-[#1C1D1A] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Browse Catalog</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#DD700B]" />
                  </button>
                </Link>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] shadow-[3px_3px_0px_0px_#1C1D1A] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-xs px-2 py-0.5 rounded-md bg-[#1C1D1A] text-[#FCF8D8]">
                      STEP 02
                    </span>
                    <ShieldCheck className="h-4 w-4 text-[#7C7D75]" />
                  </div>
                  <h3 className="font-display font-extrabold text-base text-[#1C1D1A]">
                    Dean Administrative Review
                  </h3>
                  <p className="text-xs text-[#1C1D1A]/80 leading-relaxed font-medium">
                    College authorities evaluate requests within an auditable 48-hour SLA. Rejections strictly require a mandatory gazette-backed statutory justification recorded in the immutable log.
                  </p>
                </div>

                <Link href="/admin">
                  <button
                    type="button"
                    className="w-full bg-white hover:bg-[#FCF8D8] text-[#1C1D1A] font-display font-extrabold text-xs py-2 px-3 rounded-xl border-2 border-[#1C1D1A] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Lock className="h-3 w-3 text-[#DD700B]" />
                    <span>Dean Review Portal</span>
                  </button>
                </Link>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-white border-2 border-[#1C1D1A] shadow-[3px_3px_0px_0px_#1C1D1A] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-xs px-2 py-0.5 rounded-md bg-[#1C1D1A] text-[#FCF8D8]">
                      STEP 03
                    </span>
                    <Camera className="h-4 w-4 text-[#DD700B]" />
                  </div>
                  <h3 className="font-display font-extrabold text-base text-[#1C1D1A]">
                    Pre & Post Photo Proof
                  </h3>
                  <p className="text-xs text-[#1C1D1A]/80 leading-relaxed font-medium">
                    Upload timestamped arrival photos and post-event clean handover photos. Automated inspection triggers immediate security deposit return without disputes.
                  </p>
                </div>

                <Link href="/bookings">
                  <button
                    type="button"
                    className="w-full bg-[#FCF8D8] hover:bg-[#D9DADF] text-[#1C1D1A] font-display font-extrabold text-xs py-2 px-3 rounded-xl border-2 border-[#1C1D1A] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Check-In Proof Vault</span>
                    <Camera className="h-3.5 w-3.5 text-[#DD700B]" />
                  </button>
                </Link>
              </div>
            </div>

            {/* List Idle Facility Callout */}
            <div className="pt-2 border-t-2 border-[#1C1D1A]/15 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FCF8D8] p-5 rounded-2xl border-2 border-[#1C1D1A]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#DD700B] text-white flex items-center justify-center font-bold shrink-0 shadow-[2px_2px_0px_0px_#1C1D1A]">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-[#1C1D1A]">
                    Represent a University, College, or Makerspace?
                  </h4>
                  <p className="text-xs text-[#7C7D75] font-semibold">
                    List your underused laboratories, test benches, or auditoriums with statutory quota protection.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsListModalOpen(true)}
                className="bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] font-display font-extrabold text-xs py-2.5 px-4 rounded-xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#DD700B] flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Plus className="h-3.5 w-3.5 text-[#DD700B]" />
                <span>List Idle Facility</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: ABOUT IDLESPACES & STATUTORY GUARANTEES ────────────── */}
        <section id="about" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-[11px] font-display font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] border border-[#1C1D1A]">
                About The Network
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1C1D1A] tracking-tight mt-1.5">
                Democratizing Public Infrastructure with Cryptographic Trust
              </h2>
            </div>
            <p className="text-xs text-[#7C7D75] max-w-sm font-semibold">
              Eliminating administrative gatekeeping through transparent digital auditing and verified civic quotas.
            </p>
          </div>

          {/* 4 Pillars of the About Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-2.5">
              <div className="h-10 w-10 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] flex items-center justify-center text-[#DD700B] shadow-[2px_2px_0px_0px_#1C1D1A]">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-display font-extrabold text-sm text-[#1C1D1A]">
                70% Civic Quota
              </h3>
              <p className="text-xs text-[#7C7D75] leading-relaxed font-semibold">
                State college and research facilities reserve at least 70% of off-peak hours for verified educational NGOs, non-profits, and youth skill initiatives at ₹0 tariff.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-2.5">
              <div className="h-10 w-10 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] flex items-center justify-center text-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
                <FileText className="h-5 w-5 text-[#DD700B]" />
              </div>
              <h3 className="font-display font-extrabold text-sm text-[#1C1D1A]">
                Gazette-Backed Reasons
              </h3>
              <p className="text-xs text-[#7C7D75] leading-relaxed font-semibold">
                Arbitrary administrative denials are prohibited under Section 21. Any rejection creates a public audit entry with verified statutory rationale.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-2.5">
              <div className="h-10 w-10 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] flex items-center justify-center text-[#DD700B] shadow-[2px_2px_0px_0px_#1C1D1A]">
                <Camera className="h-5 w-5" />
              </div>
              <h3 className="font-display font-extrabold text-sm text-[#1C1D1A]">
                Condition Proof Escrow
              </h3>
              <p className="text-xs text-[#7C7D75] leading-relaxed font-semibold">
                Transparent pre-event check-in and post-event check-out photographs protect expensive scientific equipment and ensure instant dispute-free deposit refunds.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-2.5">
              <div className="h-10 w-10 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] flex items-center justify-center text-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
                <ShieldCheck className="h-5 w-5 text-[#DD700B]" />
              </div>
              <h3 className="font-display font-extrabold text-sm text-[#1C1D1A]">
                ISO 27001 Sealed
              </h3>
              <p className="text-xs text-[#7C7D75] leading-relaxed font-semibold">
                Every booking token, NOC upload, and Dean signature is cryptographically sealed in an immutable state ledger for supreme audit compliance.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: FEATURED FACILITIES & TESTING LABS ─────────────────── */}
        <section id="featured-facilities" className="scroll-mt-24 space-y-6 pt-6 border-t-2 border-[#1C1D1A]/15">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="text-[11px] font-display font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#DD700B] text-white border border-[#1C1D1A]">
                  Verified Catalog
                </span>
                <span className="text-xs font-bold text-[#7C7D75]">
                  Higher Education Assets
                </span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1C1D1A] tracking-tight">
                Featured Facilities & Testing Labs
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
            <Link href="/admin" className="hover:text-[#DD700B] transition-colors">Dean Review</Link>
            <Link href="/bookings" className="hover:text-[#DD700B] transition-colors">Check-In Proof</Link>
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
