'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { Navbar } from '@/components/Navbar';
import {
  ShieldCheck,
  Building2,
  Users,
  Award,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
  Clock,
  Landmark,
  Scale,
} from 'lucide-react';

export default function AboutPage() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const isDean = user?.role === 'admin';

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
      <Navbar />

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 flex-1">
        {/* Mission Statement */}
        <section className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1D1A] text-[#FCF8D8] text-[11px] font-display font-extrabold uppercase tracking-wider">
            <HelpCircle className="h-3.5 w-3.5 text-[#DD700B]" />
            <span>Public Education Asset Directive</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[#1C1D1A] tracking-tight leading-tight">
            Built to Eliminate Wasted Academic Infrastructure
          </h1>
          <p className="text-base sm:text-lg text-[#1C1D1A]/85 font-medium leading-relaxed">
            Government colleges and universities across the state house crores worth of cutting-edge hardware, auditoriums, and stadiums that remain dormant for more than 60% of the working year. We provide the statutory bridge connecting this idle wealth to researchers and civic creators.
          </p>
        </section>

        {/* ── CORE PILLARS BENTO ───────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#1C1D1A] pb-3">
            <h2 className="font-display font-extrabold text-2xl text-[#1C1D1A]">
              Our Guiding Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] flex items-center justify-center text-[#DD700B]">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#1C1D1A]">
                Civic Primacy
              </h3>
              <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                Public funds built these campuses. When academic classes conclude, priority must revert to public good, non-profit community welfare, and grassroots scientific advancement.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#D9DADF] border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-white border-2 border-[#1C1D1A] flex items-center justify-center text-[#7C7D75]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#1C1D1A]">
                Zero Discretionary Bias
              </h3>
              <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                Rejections cannot be delivered informally or behind closed doors. Every adjudication is timestamped, sealed in public audit logs, and requires a documented statutory basis.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FCF8D8] border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-white border-2 border-[#1C1D1A] flex items-center justify-center text-[#DD700B]">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-[#1C1D1A]">
                Institutional Protection
              </h3>
              <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                Colleges retain 100% calendar sovereignty. Automated security deposit escrows and mandatory check-in photo audits guarantee facilities are returned in flawless condition.
              </p>
            </div>
          </div>
        </section>

        {/* ── FREQUENTLY ASKED QUESTIONS ACCORDION ─────────────────────────── */}
        <section className="space-y-6">
          <div className="border-b-2 border-[#1C1D1A] pb-3">
            <h2 className="font-display font-extrabold text-2xl text-[#1C1D1A]">
              Frequently Asked Questions & Statutory Clarifications
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border-2 border-[#1C1D1A] bg-white overflow-hidden shadow-[2px_2px_0px_0px_#1C1D1A]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-display font-extrabold text-sm sm:text-base text-[#1C1D1A] hover:bg-[#FCF8D8]/60 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-[#DD700B]' : 'text-[#7C7D75]'
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-[#1C1D1A]/85 font-medium leading-relaxed border-t border-[#1C1D1A]/10 bg-[#FCF8D8]/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
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
            {isDean && (
              <Link href="/admin" className="hover:text-[#DD700B] transition-colors">Dean Review</Link>
            )}
            <Link href="/user/login" className="hover:text-[#DD700B] transition-colors">User Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

