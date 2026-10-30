'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { ListSpaceModal } from '@/components/ListSpaceModal';
import { Navbar } from '@/components/Navbar';
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
  Scale,
  Sparkles,
} from 'lucide-react';

export default function HowItWorksPage() {
  const { user } = useAuth();
  const [isListModalOpen, setIsListModalOpen] = React.useState(false);
  const isDean = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#FCF8D8] text-[#1C1D1A] font-body selection:bg-[#DD700B] selection:text-white flex flex-col justify-between">
      <Navbar />

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 flex-1">
        {/* Page Hero */}
        <section className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1D1A] text-[#FCF8D8] text-[11px] font-display font-extrabold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#DD700B]" />
            <span>Fair Public Asset Operating Procedure</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-[#1C1D1A] tracking-tight leading-tight">
            How The IdleSpaces Sharing Network Works
          </h1>
          <p className="text-base sm:text-lg text-[#1C1D1A]/85 font-medium leading-relaxed">
            A step-by-step statutory protocol designed to convert empty government college halls and high-spec laboratories into community research powerhouses with zero red tape and complete transparency.
          </p>
        </section>

        {/* ── THE 3 CORE STEPS ─────────────────────────────────────────────── */}
        <section className="space-y-8">
          <div className="border-b-2 border-[#1C1D1A] pb-3">
            <h2 className="font-display font-extrabold text-2xl text-[#1C1D1A]">
              The 3-Step Lifecycle
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-xs px-2.5 py-1 rounded-full bg-[#FCF8D8] text-[#DD700B] border border-[#1C1D1A]">
                    STEP 01
                  </span>
                  <div className="h-8 w-8 rounded-xl bg-[#FCF8D8] border border-[#1C1D1A] flex items-center justify-center text-[#DD700B]">
                    <Search className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#1C1D1A]">
                  Discover & Requisition
                </h3>
                <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                  Explore real-time seat counts, equipment lists, and civic quota availability for labs, auditoriums, and grounds across state universities.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FCF8D8] border border-[#1C1D1A] text-[11px] font-semibold text-[#1C1D1A] space-y-1">
                <span className="font-display font-extrabold text-[10px] uppercase text-[#DD700B] block">Statutory Rule:</span>
                <p>70% of vacant capacity is ring-fenced for registered non-profits & societal bodies under State Resolution 41-B.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-[#D9DADF] border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-xs px-2.5 py-1 rounded-full bg-white text-[#7C7D75] border border-[#1C1D1A]">
                    STEP 02
                  </span>
                  <div className="h-8 w-8 rounded-xl bg-white border border-[#1C1D1A] flex items-center justify-center text-[#7C7D75]">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#1C1D1A]">
                  Dean 48-Hour SLA Review
                </h3>
                <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                  Institutional authorities must adjudicate all submitted requests within 48 working hours. Arbitrary or verbal rejections are strictly prohibited by law.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#1C1D1A] text-[11px] font-semibold text-[#1C1D1A] space-y-1">
                <span className="font-display font-extrabold text-[10px] uppercase text-[#7C7D75] block">Anti-Corruption Guard:</span>
                <p>Any denial requires a mandatory, written gazette-referenced rationale recorded in the immutable audit log.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-extrabold text-xs px-2.5 py-1 rounded-full bg-[#FCF8D8] text-[#DD700B] border border-[#1C1D1A]">
                    STEP 03
                  </span>
                  <div className="h-8 w-8 rounded-xl bg-[#FCF8D8] border border-[#1C1D1A] flex items-center justify-center text-[#DD700B]">
                    <Camera className="h-4 w-4" />
                  </div>
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#1C1D1A]">
                  Pre & Post Photo Check
                </h3>
                <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                  Applicants upload timestamped arrival photos and clean checkout photos. Verified handovers guarantee immediate security deposit refund.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#D9DADF] border border-[#1C1D1A] text-[11px] font-semibold text-[#1C1D1A] space-y-1">
                <span className="font-display font-extrabold text-[10px] uppercase text-[#1C1D1A] block">Zero Dispute Guarantee:</span>
                <p>Hardware condition baseline images protect institutions while shielding applicants from false liability.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATUTORY TRUST MANDATE ──────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] p-6 sm:p-10 space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="font-display font-extrabold text-xs text-[#DD700B] uppercase tracking-wider block">
              Legal Framework
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1C1D1A] tracking-tight">
              Section 21: The Anti-Arbitrary Allocation Standard
            </h2>
            <p className="text-xs sm:text-sm text-[#7C7D75] font-semibold leading-relaxed">
              How idle university infrastructure allocation is protected from bureaucratic bottlenecks and political favoritism.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] space-y-2">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-[#DD700B]" />
                <h4 className="font-display font-extrabold text-sm text-[#1C1D1A]">Non-Discrimination</h4>
              </div>
              <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                Requests are processed via first-to-verify ordering. No dean or committee member can displace a confirmed reservation without gazette cause.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#7C7D75]" />
                <h4 className="font-display font-extrabold text-sm text-[#1C1D1A]">Audit Trail Sealed</h4>
              </div>
              <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                Every booking submission, approval, rejection note, and condition photo is permanently hashed into the central security and audit trail.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-[#1C1D1A] space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#DD700B]" />
                <h4 className="font-display font-extrabold text-sm text-[#1C1D1A]">Damage Escrow</h4>
              </div>
              <p className="text-xs text-[#1C1D1A]/80 font-medium leading-relaxed">
                At conclusion, a clean checkout photograph matching baseline standards triggers automated security escrow release with zero administrative delay.
              </p>
            </div>
          </div>
        </section>

        {/* ── ROLE-BASED CALLOUT BANNER ───────────────────────────────────── */}
        {isDean ? (
          <section className="p-8 rounded-3xl bg-[#1C1D1A] text-[#FCF8D8] border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#DD700B] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="font-display font-extrabold text-xs text-[#DD700B] uppercase tracking-wider block">
                For College Deans & Facility Custodians
              </span>
              <h3 className="font-display font-extrabold text-2xl text-[#FCF8D8] tracking-tight">
                Have Underused Labs, Testing Benches, or Halls?
              </h3>
              <p className="text-xs sm:text-sm text-[#D9DADF] font-semibold leading-relaxed">
                Register your institution’s idle hours in the public ledger. Retain 100% administrative authority while contributing to state civic research quotas.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsListModalOpen(true)}
              className="bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs py-3 px-6 rounded-2xl border-2 border-white shadow-[3px_3px_0px_0px_white] flex items-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Rent Out Institutional Facility</span>
            </button>
          </section>
        ) : (
          <section className="p-8 rounded-3xl bg-[#FCF8D8] border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="font-display font-extrabold text-xs text-[#DD700B] uppercase tracking-wider block">
                For NGOs, Researchers & Grassroots Bodies
              </span>
              <h3 className="font-display font-extrabold text-2xl text-[#1C1D1A] tracking-tight">
                Ready to Access State-of-the-Art College Spaces?
              </h3>
              <p className="text-xs sm:text-sm text-[#7C7D75] font-semibold leading-relaxed">
                Browse our verified inventory of high-capacity auditoriums, AI labs, and athletic grounds available for subsidized civic rental.
              </p>
            </div>

            <Link href="/discover">
              <button
                type="button"
                className="bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs py-3 px-6 rounded-2xl border-2 border-[#1C1D1A] shadow-[3px_3px_0px_0px_#1C1D1A] flex items-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer shrink-0"
              >
                <span>Browse Available Spaces</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </Link>
          </section>
        )}
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
            {isDean && (
              <Link href="/admin" className="hover:text-[#DD700B] transition-colors">Dean Review</Link>
            )}
            <Link href="/user/login" className="hover:text-[#DD700B] transition-colors">User Portal</Link>
          </div>
        </div>
      </footer>

      {/* List Space Modal (Only accessible for Deans to rent out facilities) */}
      <ListSpaceModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
      />
    </div>
  );
}

