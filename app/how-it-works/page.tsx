'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { ListSpaceModal } from '@/components/ListSpaceModal';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Lock,
  Camera,
  CheckCircle2,
  FileText,
  Clock,
  Building,
  Plus,
  LogIn,
  LogOut,
  AlertCircle,
  HelpCircle,
  Scale,
  Sparkles,
} from 'lucide-react';

export default function HowItWorksPage() {
  const { user, logout } = useAuth();
  const [isListModalOpen, setIsListModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#FCF8D8] text-[#1C1D1A] font-body selection:bg-[#DD700B] selection:text-white flex flex-col justify-between">
      {/* ── TOP HEADER ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#FCF8D8]/95 backdrop-blur-md border-b-2 border-[#1C1D1A] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1C1D1A] group-hover:text-[#DD700B] transition-colors">
              idlespaces.
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#DD700B] animate-pulse" />
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-display font-bold text-[#1C1D1A]">
            <Link href="/" className="hover:text-[#DD700B] transition-colors py-1">
              Home
            </Link>
            <Link href="/discover" className="hover:text-[#DD700B] transition-colors py-1 flex items-center gap-1">
              <span>Explore Spaces</span>
              <ArrowUpRight className="h-3 w-3 text-[#DD700B]" />
            </Link>
            <Link href="/how-it-works" className="text-[#DD700B] py-1 border-b-2 border-[#DD700B]">
              How It Works
            </Link>
            <Link href="/about" className="hover:text-[#DD700B] transition-colors py-1">
              About
            </Link>
          </nav>

          {/* User Auth CTAs */}
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

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 flex-1">
        {/* Page Hero */}
        <section className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1D1A] text-[#FCF8D8] text-[11px] font-display font-extrabold uppercase tracking-wider">
            <Sparkles className="h-3 w-3 text-[#DD700B]" />
            <span>Step-by-Step Lifecycle</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[#1C1D1A] tracking-tight leading-tight">
            How The IdleSpaces Network Operates
          </h1>
          <p className="text-base sm:text-lg text-[#1C1D1A]/80 font-medium leading-relaxed">
            A frictionless, anti-corruption protocol designed to share state college laboratories, auditoriums, and prototyping equipment with grassroots researchers and NGOs—with zero bureaucratic arbitrariness.
          </p>
        </section>

        {/* ── 3 PRIMARY LIFECYCLE PHASES ──────────────────────────────────── */}
        <section className="space-y-10">
          {/* Phase 1 */}
          <div className="bg-white rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-3">
              <span className="font-display font-extrabold text-xs px-2.5 py-1 rounded-md bg-[#1C1D1A] text-[#FCF8D8] inline-block">
                PHASE 01 • CITIZEN REQUISITION
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1C1D1A] tracking-tight">
                Discover & Request Facility
              </h2>
              <p className="text-xs text-[#7C7D75] font-semibold">
                Transparent calendar booking with automated statutory quota classification.
              </p>
              <div className="pt-2">
                <Link href="/discover">
                  <button
                    type="button"
                    className="bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs py-2.5 px-4 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Open Public Catalog</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] space-y-2">
                <div className="flex items-center gap-2 font-display font-extrabold text-xs text-[#1C1D1A]">
                  <CheckCircle2 className="h-4 w-4 text-[#DD700B]" />
                  <span>Tier 1: 70% Reserved Quota</span>
                </div>
                <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                  Non-profits, registered charities (80G), and educational researchers qualify for priority access at ₹0 booking fees during unutilized institutional windows.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] space-y-2">
                <div className="flex items-center gap-2 font-display font-extrabold text-xs text-[#1C1D1A]">
                  <FileText className="h-4 w-4 text-[#1C1D1A]" />
                  <span>Statutory NOC Document Upload</span>
                </div>
                <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                  Upload trust deed, society registration, or corporate credential once. Document hashes are sealed directly to your permanent booking token.
                </p>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-white rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-3">
              <span className="font-display font-extrabold text-xs px-2.5 py-1 rounded-md bg-[#DD700B] text-white inline-block">
                PHASE 02 • STATUTORY REVIEW
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1C1D1A] tracking-tight">
                Audited Dean SLA Adjudication
              </h2>
              <p className="text-xs text-[#7C7D75] font-semibold">
                Strict 48-hour response window with zero unrecorded rejections.
              </p>
              <div className="pt-2">
                <Link href="/login">
                  <button
                    type="button"
                    className="bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] font-display font-extrabold text-xs py-2.5 px-4 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#DD700B] flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Lock className="h-3.5 w-3.5 text-[#DD700B]" />
                    <span>Dean Review Gateway</span>
                  </button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] space-y-2">
                <div className="flex items-center gap-2 font-display font-extrabold text-xs text-[#1C1D1A]">
                  <Clock className="h-4 w-4 text-[#DD700B]" />
                  <span>Statutory 48-Hour Timer</span>
                </div>
                <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                  College authorities must adjudicate incoming requests within 48 business hours. Every minute elapsed is tracked live in the state monitoring ledger.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] space-y-2">
                <div className="flex items-center gap-2 font-display font-extrabold text-xs text-[#1C1D1A]">
                  <Scale className="h-4 w-4 text-[#1C1D1A]" />
                  <span>Mandatory Section 21 Justification</span>
                </div>
                <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                  Arbitrary verbal rejections are illegal. The authority must log an official gazette-backed ground (e.g. prior statutory reservation or maintenance shutdown).
                </p>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-white rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-3">
              <span className="font-display font-extrabold text-xs px-2.5 py-1 rounded-md bg-[#7C7D75] text-[#FCF8D8] inline-block">
                PHASE 03 • PHYSICAL ACCOUNTABILITY
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1C1D1A] tracking-tight">
                Pre & Post Photographic Escrow
              </h2>
              <p className="text-xs text-[#7C7D75] font-semibold">
                Guaranteed security for high-value research hardware and equipment.
              </p>
              <div className="pt-2">
                <Link href="/bookings">
                  <button
                    type="button"
                    className="bg-white hover:bg-[#D9DADF] text-[#1C1D1A] font-display font-extrabold text-xs py-2.5 px-4 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Camera className="h-3.5 w-3.5 text-[#DD700B]" />
                    <span>Check-In & Proof Vault</span>
                  </button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] space-y-2">
                <div className="flex items-center gap-2 font-display font-extrabold text-xs text-[#1C1D1A]">
                  <Camera className="h-4 w-4 text-[#DD700B]" />
                  <span>Check-In Baseline Photo</span>
                </div>
                <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                  Upon arrival, the applicant takes a wide-angle snapshot of the facility to register pre-existing condition, ensuring they are not liable for older flaws.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] space-y-2">
                <div className="flex items-center gap-2 font-display font-extrabold text-xs text-[#1C1D1A]">
                  <ShieldCheck className="h-4 w-4 text-[#1C1D1A]" />
                  <span>Automated Deposit Release</span>
                </div>
                <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                  At conclusion, a clean checkout photograph matching baseline standards triggers automated security escrow release with zero administrative delay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CALLOUT BANNER: LIST AN IDLE FACILITY ───────────────────────── */}
        <section className="p-8 rounded-3xl bg-[#FCF8D8] border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="font-display font-extrabold text-xs text-[#DD700B] uppercase tracking-wider block">
              For Universities & Labs
            </span>
            <h3 className="font-display font-extrabold text-2xl text-[#1C1D1A] tracking-tight">
              Have Underused Labs, Testing Benches, or Halls?
            </h3>
            <p className="text-xs sm:text-sm text-[#7C7D75] font-semibold leading-relaxed">
              Register your institution’s idle hours in the public ledger. Retain 100% administrative authority while contributing to state civic research quotas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsListModalOpen(true)}
            className="bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] font-display font-extrabold text-xs py-3 px-6 rounded-2xl border-2 border-[#1C1D1A] shadow-[3px_3px_0px_0px_#DD700B] flex items-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4 text-[#DD700B]" />
            <span>List Institutional Facility</span>
          </button>
        </section>
      </main>

      {/* ── GROUNDED FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t-2 border-[#1C1D1A] bg-[#FCF8D8] py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#7C7D75]">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm text-[#1C1D1A]">idlespaces.</span>
            <span>• Fair Access & Institutional Asset Sharing Network</span>
          </div>

          <div className="flex items-center gap-4 text-[#1C1D1A]">
            <Link href="/" className="hover:text-[#DD700B] transition-colors">Home</Link>
            <Link href="/discover" className="hover:text-[#DD700B] transition-colors">Catalog</Link>
            <Link href="/about" className="hover:text-[#DD700B] transition-colors">About</Link>
            <Link href="/user/login" className="hover:text-[#DD700B] transition-colors">User Portal</Link>
          </div>
        </div>
      </footer>

      {/* List Space Modal */}
      <ListSpaceModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
      />
    </div>
  );
}
