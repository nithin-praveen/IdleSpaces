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
      {/* ── TOP NAVIGATION BAR (NO ORANGE STRIP) ─────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FCF8D8]/95 backdrop-blur-md border-b-2 border-[#1C1D1A] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1C1D1A] group-hover:text-[#DD700B] transition-colors">
              idlespaces.
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#DD700B] animate-pulse" />
            <span className="hidden sm:inline-block text-[10px] font-display font-bold px-2 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] uppercase tracking-wider ml-1">
              Public Portal
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2">
            <Link href="/discover">
              <div className="bg-[#DD700B] hover:bg-[#c96205] text-white px-3.5 py-1.5 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] text-xs font-display font-bold flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer">
                <span className="px-1 py-0.2 rounded bg-black/25 text-[10px]">01</span>
                <span>Discover</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </Link>

            <Link href="/admin">
              <div className="bg-[#7C7D75] hover:bg-[#686962] text-[#FCF8D8] px-3.5 py-1.5 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] text-xs font-display font-bold flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer">
                <span className="px-1 py-0.2 rounded bg-black/25 text-[10px]">02</span>
                <span>Dean Review</span>
                <Lock className="h-3 w-3 text-[#FCF8D8]" />
              </div>
            </Link>

            <Link href="/bookings">
              <div className="bg-[#ADACA7] hover:bg-[#999893] text-[#1C1D1A] px-3.5 py-1.5 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] text-xs font-display font-bold flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer">
                <span className="px-1 py-0.2 rounded bg-black/20 text-[10px]">03</span>
                <span>Check-In Proof</span>
                <Camera className="h-3 w-3" />
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setIsListModalOpen(true)}
              className="bg-[#D9DADF] hover:bg-[#c7c9cf] text-[#1C1D1A] px-3.5 py-1.5 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] text-xs font-display font-bold flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-[#DD700B]" />
              <span>List Facility</span>
            </button>
          </nav>

          {/* Top Right: User Login & Admin Login Options */}
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

      {/* ── CALM & RELAXED HERO SECTION (MATCHING REFERENCE LAYOUT) ──────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 flex-1">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Calm Editorial Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Subtle Platform Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9DADF] border-2 border-[#1C1D1A] text-xs font-bold text-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
              <span className="h-2 w-2 rounded-full bg-[#DD700B] animate-pulse" />
              <span>Institutional Sharing Platform</span>
            </div>

            {/* Exactly Specified Headline */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#1C1D1A] tracking-tight leading-[1.05]">
              Unlock <br className="hidden sm:inline" />
              underused spaces <br className="hidden sm:inline" />
              & equipment.
            </h1>

            {/* Exactly Specified Body Copy */}
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

          {/* Right Column: Original doodle placed directly on the page without box or white background */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <img
              src="/hero-doodle-clean.png"
              alt="Institutional Space and Equipment Sharing Network"
              className="w-full max-w-xl h-auto object-contain select-none pointer-events-none"
            />
          </div>
        </section>

        {/* ── SECTION 2: CLEAN FEATURED FACILITIES ─────────────────────────── */}
        <section className="space-y-6 pt-6 border-t-2 border-[#1C1D1A]/15">
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
              const tagBg = index === 0 ? 'bg-[#DD700B] text-white' : index === 1 ? 'bg-[#7C7D75] text-[#FCF8D8]' : 'bg-[#ADACA7] text-[#1C1D1A]';

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

        {/* ── SECTION 3: 3 SIMPLE HOW IT WORKS STEPS ───────────────────────── */}
        <section className="bg-white rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] p-6 sm:p-8 space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] space-y-2">
              <span className="font-display font-extrabold text-xs text-[#DD700B] block">STEP 01</span>
              <h3 className="font-display font-extrabold text-base text-[#1C1D1A]">Discover & Request</h3>
              <p className="text-xs text-[#1C1D1A]/80 leading-relaxed font-medium">
                NGOs and researchers choose slots and upload society registration or 80G certificates. Tier 1 community priority applies automatically.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] space-y-2">
              <span className="font-display font-extrabold text-xs text-[#7C7D75] block">STEP 02</span>
              <h3 className="font-display font-extrabold text-base text-[#1C1D1A]">Dean Administrative Review</h3>
              <p className="text-xs text-[#1C1D1A]/80 leading-relaxed font-medium">
                Institutional authorities review applications within 48 hours. Any rejection strictly requires a mandatory gazette-backed statutory reason.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#1C1D1A] space-y-2">
              <span className="font-display font-extrabold text-xs text-[#ADACA7] block">STEP 03</span>
              <h3 className="font-display font-extrabold text-base text-[#1C1D1A]">Pre & Post Photo Proof</h3>
              <p className="text-xs text-[#1C1D1A]/80 leading-relaxed font-medium">
                Upload timestamped arrival photos and clean checkout photos. Verified handovers authorize automated security deposit release without disputes.
              </p>
            </div>
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
