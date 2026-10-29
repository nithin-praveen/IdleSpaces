'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import {
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Users,
  Award,
  Lock,
  LogIn,
  LogOut,
  HelpCircle,
  FileCheck,
  Scale,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export default function AboutPage() {
  const { user, logout } = useAuth();
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const FAQS = [
    {
      q: 'What qualifies an organization for the Tier 1 70% Civic Quota?',
      a: 'Any verified educational non-profit, registered society/trust (80G/12A), student research consortium, or grassroots community initiative qualifies. Verified Tier 1 entities receive subsidized or ₹0 tariff allocation for available off-peak academic slots.',
    },
    {
      q: 'How does Section 21 prevent bureaucratic discretion and favoritism?',
      a: 'Under Section 21 of the Public Asset Transparency Framework, institution heads cannot issue arbitrary or verbal denials. Every rejection strictly mandates an official gazette-backed reason that is permanently recorded in the immutable audit ledger.',
    },
    {
      q: 'What happens if a facility authority fails to review a request within 48 hours?',
      a: 'The requisition is escalated automatically to the State Higher Education Oversight Board with an active SLA breach flag, prompting statutory intervention and inquiry.',
    },
    {
      q: 'How is delicate or expensive laboratory hardware protected against damage?',
      a: 'Our dual-condition photographic protocol requires high-resolution baseline photos upon arrival and clean handover photos at checkout. Automated escrow holds and releases security deposits based on verifiable visual proof.',
    },
    {
      q: 'Who retains Intellectual Property (IP) developed using shared equipment?',
      a: '100% of all intellectual property, prototypes, scientific findings, and creative works remain the sole property of the booking applicant. The host institution exercises zero ownership claim over applicant research.',
    },
  ];

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
            <Link href="/how-it-works" className="hover:text-[#DD700B] transition-colors py-1">
              How It Works
            </Link>
            <Link href="/about" className="text-[#DD700B] py-1 border-b-2 border-[#DD700B]">
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
            <Scale className="h-3 w-3 text-[#DD700B]" />
            <span>Public Asset Stewardship</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[#1C1D1A] tracking-tight leading-tight">
            Democratizing Public Infrastructure for the Common Good
          </h1>
          <p className="text-base sm:text-lg text-[#1C1D1A]/80 font-medium leading-relaxed">
            IdleSpaces was created on a single, uncompromising premise: tax-funded educational laboratories, test benches, and halls should not sit locked behind bureaucratic red tape while grassroots creators and educators lack access.
          </p>
        </section>

        {/* ── MISSION & STORY BENTO ────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-8 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] space-y-4">
            <span className="font-display font-extrabold text-xs text-[#DD700B] uppercase tracking-wider block">
              The Origin Problem
            </span>
            <h2 className="font-display font-extrabold text-2xl text-[#1C1D1A] tracking-tight">
              The \$4.2 Billion Underutilization Paradox
            </h2>
            <p className="text-xs sm:text-sm text-[#1C1D1A]/85 leading-relaxed font-medium">
              Every day across the nation, state-of-the-art gene sequencing suites, 5-axis CNC mills, cleanrooms, and 1,000-seat auditoriums go completely dark at 5:00 PM and remain vacant throughout long semester recesses.
            </p>
            <p className="text-xs sm:text-sm text-[#1C1D1A]/85 leading-relaxed font-medium">
              Simultaneously, grassroots non-profits running youth robotics bootcamps, community health workshops, and civic hackathons are locked out by prohibitive private venue rates and labyrinthine bureaucratic permissions. IdleSpaces removes this friction by establishing statutory public access rights.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#FCF8D8] border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="font-display font-extrabold text-xs text-[#1C1D1A] uppercase tracking-wider block">
                Our Guarantee
              </span>
              <h3 className="font-display font-extrabold text-xl text-[#1C1D1A]">
                Auditability Over Discretion
              </h3>
              <p className="text-xs text-[#7C7D75] font-semibold leading-relaxed">
                By replacing subjective administrative gatekeeping with open immutable audit trails, every space request is adjudicable and permanently accountable.
              </p>
            </div>
            <div className="p-3 bg-white rounded-2xl border-2 border-[#1C1D1A] text-center">
              <span className="font-display font-extrabold text-2xl text-[#DD700B] block">100%</span>
              <span className="text-[10px] font-bold text-[#1C1D1A] uppercase tracking-wider">
                Cryptographically Sealed Logs
              </span>
            </div>
          </div>
        </section>

        {/* ── 4 CORE STATUTORY PILLARS ─────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#1C1D1A] pb-3">
            <h2 className="font-display font-extrabold text-2xl text-[#1C1D1A] tracking-tight">
              The IdleSpaces Operational Charter
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] flex items-center justify-center text-[#DD700B] shadow-[2px_2px_0px_0px_#1C1D1A]">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-display font-extrabold text-sm text-[#1C1D1A]">
                70% Civic Quota
              </h3>
              <p className="text-xs text-[#7C7D75] leading-relaxed font-semibold">
                Guarantees that at least 70% of all off-peak equipment hours are reserved exclusively for non-profit and educational initiatives at ₹0 tariff.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] flex items-center justify-center text-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
                <FileCheck className="h-5 w-5 text-[#DD700B]" />
              </div>
              <h3 className="font-display font-extrabold text-sm text-[#1C1D1A]">
                Section 21 Mandate
              </h3>
              <p className="text-xs text-[#7C7D75] leading-relaxed font-semibold">
                Precludes arbitrary verbal rejections. Every refusal must be formally gazette-justified and logged to the central administrative registry.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] flex items-center justify-center text-[#DD700B] shadow-[2px_2px_0px_0px_#1C1D1A]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display font-extrabold text-sm text-[#1C1D1A]">
                Condition Proof Escrow
              </h3>
              <p className="text-xs text-[#7C7D75] leading-relaxed font-semibold">
                Dual photographic verification at arrival and checkout eliminates post-event security deposit disputes and preserves expensive academic equipment.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] flex items-center justify-center text-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
                <Lock className="h-5 w-5 text-[#DD700B]" />
              </div>
              <h3 className="font-display font-extrabold text-sm text-[#1C1D1A]">
                ISO/IEC 27001 Sealed
              </h3>
              <p className="text-xs text-[#7C7D75] leading-relaxed font-semibold">
                All booking records, institutional approvals, and security audit hashes adhere to strict enterprise information security and data integrity standards.
              </p>
            </div>
          </div>
        </section>

        {/* ── FREQUENTLY ASKED QUESTIONS (FAQ) ─────────────────────────────── */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#1C1D1A] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-display font-extrabold text-xs text-[#DD700B] uppercase tracking-wider block">
                Frequently Asked Questions
              </span>
              <h2 className="font-display font-extrabold text-2xl text-[#1C1D1A] tracking-tight">
                Clear Answers to Common Questions
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#7C7D75]">
              Everything you need to know about the sharing network
            </span>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border-2 border-[#1C1D1A] bg-white overflow-hidden shadow-[3px_3px_0px_0px_#1C1D1A] transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FCF8D8]/50 transition-colors"
                  >
                    <span className="font-display font-extrabold text-sm sm:text-base text-[#1C1D1A]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#DD700B] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#1C1D1A]/85 font-medium leading-relaxed border-t border-[#1C1D1A]/10 bg-[#FCF8D8]/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── READY TO EXPLORE CTA ─────────────────────────────────────────── */}
        <section className="p-8 rounded-3xl bg-[#1C1D1A] text-[#FCF8D8] border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#DD700B] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-lg">
            <h3 className="font-display font-extrabold text-2xl text-[#FCF8D8] tracking-tight">
              Ready to Share or Reserve an Asset?
            </h3>
            <p className="text-xs text-[#D9DADF] font-semibold leading-relaxed">
              Explore the verified public catalog or sign in with your verified institutional credential.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/discover">
              <button
                type="button"
                className="bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs py-3 px-5 rounded-2xl border-2 border-white shadow-[2px_2px_0px_0px_white] flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/user/login">
              <button
                type="button"
                className="bg-[#FCF8D8] hover:bg-white text-[#1C1D1A] font-display font-extrabold text-xs py-3 px-5 rounded-2xl border-2 border-white flex items-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <span>User Portal</span>
              </button>
            </Link>
          </div>
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
            <Link href="/how-it-works" className="hover:text-[#DD700B] transition-colors">How It Works</Link>
            <Link href="/user/login" className="hover:text-[#DD700B] transition-colors">User Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
