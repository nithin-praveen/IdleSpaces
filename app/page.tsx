import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LogIn,
  Landmark,
  ShieldCheck,
  Building,
  Users,
  ArrowRight,
  FileCheck2,
  Lock,
  CalendarCheck,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Official Government Banner */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-900 flex items-center justify-center text-white shadow-xs">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 tracking-tight">IdleSpaces</span>
              <span className="hidden sm:inline-block ml-2 text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                National College Asset Gateway
              </span>
            </div>
          </div>
          <Link href="/discover">
            <Button variant="gov" size="sm" className="font-semibold gap-1.5">
              <span>Open Portal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/70 border border-blue-200/80 px-4 py-1.5 text-xs font-semibold text-blue-900">
          <ShieldCheck className="h-4 w-4 text-blue-700" />
          <span>Statutory Asset Fair Allocation & Anti-Corruption Framework</span>
        </div>

        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Fair Allocation of Government College Assets for Community Good
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Democratizing access to idle public college auditoriums, advanced computer labs, and multi-sport grounds. Built with mandatory immutable audit logging to eliminate arbitrary discretion.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/discover">
            <Button variant="gov" size="lg" className="gap-2 px-6 py-6 text-sm sm:text-base font-semibold shadow-md">
              <span>1. Discover & Request</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="default" size="lg" className="gap-2 px-6 py-6 text-sm sm:text-base font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-md">
              <Lock className="h-4 w-4 text-amber-400" />
              <span>2. Dean's Audit Review</span>
            </Button>
          </Link>
          <Link href="/bookings">
            <Button variant="outline" size="lg" className="gap-2 px-6 py-6 text-sm sm:text-base font-semibold border-slate-300 shadow-sm">
              <FileCheck2 className="h-4 w-4 text-purple-600" />
              <span>3. Check-In & Proof</span>
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left max-w-5xl w-full">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Tier 1 NGO Priority</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              70% reserved quota for registered charitable societies, non-profits, and educational initiatives with zero or nominal maintenance tariff.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Immutable Audit Trail</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every status update requires a mandatory statutory rationale. Rejection or approval without justification is programmatically prohibited.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Digital NOC & Condition Reports</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Secure verification with digital certificate upload, time-stamped check-in/out condition reports, and anti-vandalism accountability.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>IdleSpaces • Public College Infrastructure Transparency Portal • National Informatics & Education Standards</p>
      </footer>
    </div>
  );
}
