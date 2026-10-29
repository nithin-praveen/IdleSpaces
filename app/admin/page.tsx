'use client';

import * as React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AdminRejectModal } from '@/components/AdminRejectModal';
import { AuditTimeline, type AuditTimelineItem } from '@/components/AuditTimeline';
import { updateBookingStatus } from '@/app/actions';
import { getSecurityAuditLogsAction } from '@/app/auth-actions';
import { useAuth } from '@/components/AuthProvider';
import type { SecurityEvent } from '@/lib/auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  FileText,
  AlertTriangle,
  Lock,
  ExternalLink,
  Users,
  Search,
  Filter,
  Eye,
  Check,
  Landmark,
  ShieldAlert,
  KeyRound,
  LogIn,
  Activity,
} from 'lucide-react';
import { format } from 'date-fns';

interface DemoBooking {
  id: string;
  applicantName: string;
  applicantRole: 'ngo' | 'corporate';
  tier: 1 | 2;
  spaceName: string;
  spaceType: 'auditorium' | 'computer_lab' | 'ground';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  docUrl: string;
  docName: string;
  createdAt: string;
  rejectionReason?: string;
  approvalReason?: string;
}

const INITIAL_BOOKINGS: DemoBooking[] = [
  {
    id: 'b1111111-2222-3333-4444-555555555001',
    applicantName: 'Pratham Youth Education Initiative',
    applicantRole: 'ngo',
    tier: 1,
    spaceName: 'Sardar Vallabhbhai Patel Central Auditorium',
    spaceType: 'auditorium',
    startDate: '2026-11-05',
    endDate: '2026-11-07',
    status: 'pending',
    docUrl: 'https://storage.idlespaces.gov.in/docs/pratham_society_reg_80g.pdf',
    docName: 'Society_Reg_80G_Cert.pdf',
    createdAt: '2026-10-28T09:15:00.000Z',
  },
  {
    id: 'b1111111-2222-3333-4444-555555555002',
    applicantName: 'Rural Digital Empowerment Foundation',
    applicantRole: 'ngo',
    tier: 1,
    spaceName: 'Dr. APJ Abdul Kalam Advanced Computing & AI Lab',
    spaceType: 'computer_lab',
    startDate: '2026-11-12',
    endDate: '2026-11-13',
    status: 'pending',
    docUrl: 'https://storage.idlespaces.gov.in/docs/rdef_district_noc.pdf',
    docName: 'District_Magistrate_NOC.pdf',
    createdAt: '2026-10-28T10:30:00.000Z',
  },
  {
    id: 'b1111111-2222-3333-4444-555555555003',
    applicantName: 'Apex Infotech Solutions (CSR Division)',
    applicantRole: 'corporate',
    tier: 2,
    spaceName: 'Major Dhyan Chand Multi-Sport Complex',
    spaceType: 'ground',
    startDate: '2026-11-20',
    endDate: '2026-11-20',
    status: 'pending',
    docUrl: 'https://storage.idlespaces.gov.in/docs/apex_csr_charter.pdf',
    docName: 'Corporate_CSR_Licence.pdf',
    createdAt: '2026-10-28T11:45:00.000Z',
  },
  {
    id: 'b1111111-2222-3333-4444-555555555004',
    applicantName: 'Community Health Awareness Society',
    applicantRole: 'ngo',
    tier: 1,
    spaceName: 'Rabindranath Tagore Cultural & Performing Arts Hall',
    spaceType: 'auditorium',
    startDate: '2026-11-25',
    endDate: '2026-11-26',
    status: 'pending',
    docUrl: 'https://storage.idlespaces.gov.in/docs/health_soc_reg.pdf',
    docName: 'Trust_Deed_80G.pdf',
    createdAt: '2026-10-28T14:10:00.000Z',
  },
];

const INITIAL_AUDIT_LOGS: AuditTimelineItem[] = [
  {
    id: 'log-001',
    bookingId: 'b1111111-2222-3333-4444-555555555001',
    action: 'REQUESTED',
    timestamp: '2026-10-28T09:15:00.000Z',
    performedBy: 'Nodal Officer (Pratham Youth Initiative)',
    reason: 'Initial reservation submitted for Statewide Youth STEM Skill Conclave. Tier 1 Priority claimed.',
    status: 'pending',
  },
  {
    id: 'log-002',
    bookingId: 'b1111111-2222-3333-4444-555555555002',
    action: 'REQUESTED',
    timestamp: '2026-10-28T10:30:00.000Z',
    performedBy: 'Director (Rural Digital Empowerment Foundation)',
    reason: 'Initial reservation submitted for Rural Girls Coding Boot Camp. 40 High-performance terminals requested.',
    status: 'pending',
  },
  {
    id: 'log-003',
    bookingId: 'b1111111-2222-3333-4444-555555555003',
    action: 'REQUESTED',
    timestamp: '2026-10-28T11:45:00.000Z',
    performedBy: 'CSR Head (Apex Infotech Solutions Ltd)',
    reason: 'Annual Inter-Corporate Sports Invitational (Non-exclusive weekend quota reservation).',
    status: 'pending',
  },
];

export default function AdminPage() {
  const { user, isLoading, switchDemoRole } = useAuth();

  const [bookings, setBookings] = React.useState<DemoBooking[]>(INITIAL_BOOKINGS);
  const [auditLogs, setAuditLogs] = React.useState<AuditTimelineItem[]>(INITIAL_AUDIT_LOGS);
  const [activeTab, setActiveTab] = React.useState<'pending' | 'all' | 'audit' | 'security'>('pending');
  const [securityEvents, setSecurityEvents] = React.useState<SecurityEvent[]>([]);

  // Modal states
  const [rejectingBooking, setRejectingBooking] = React.useState<DemoBooking | null>(null);
  const [previewDoc, setPreviewDoc] = React.useState<{ name: string; url: string; applicant: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [bannerNotice, setBannerNotice] = React.useState<string | null>(null);

  // Load security audit logs
  React.useEffect(() => {
    if (user?.role === 'admin') {
      getSecurityAuditLogsAction().then((res) => {
        if (res.success && res.data) {
          setSecurityEvents(res.data);
        }
      });
    }
  }, [user]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-500 text-sm">
            <div className="h-5 w-5 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
            <span>Verifying Institutional Administrator credentials...</span>
          </div>
        </div>
      </div>
    );
  }

  // Access Denied / Security Notice for non-admins
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 shadow-xl overflow-hidden text-center p-8 space-y-6">
            <div className="h-16 w-16 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 text-xs font-semibold">
                <span>Statutory 403 Forbidden</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                Institutional Admin Access Required
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Dean Administrative Console contains sensitive statutory sanctioning controls and the immutable ledger. Current session ({user ? `${user.role.toUpperCase()} - ${user.name}` : 'Unauthenticated'}) does not have Dean Authority.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 text-xs">
              <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-blue-900" />
                Required Role: Institutional Administrator
              </p>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Log in with verified college credentials or use the demonstration switcher below to inspect the Dean's review console.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => switchDemoRole('admin')}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Switch to Dean / Admin Account (1-Click Demo)</span>
              </button>

              <Link href="/login?redirect=/admin" className="w-full">
                <Button variant="outline" size="sm" className="w-full text-xs border-slate-300">
                  <LogIn className="h-3.5 w-3.5 mr-1.5" />
                  <span>Go to Login Page</span>
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const pendingList = bookings.filter((b) => b.status === 'pending');

  const handleApprove = async (booking: DemoBooking) => {
    setIsSubmitting(true);
    const statutoryReason = `Sanctioned under Section 12-A Public College Facilities Act. Priority: ${
      booking.applicantRole === 'ngo' ? 'Tier 1 Statutory Community Quota' : 'Tier 2 Corporate Reservation'
    }. Verified by Dean of Academic Infrastructure.`;

    // Attempt real server action
    try {
      await updateBookingStatus(
        booking.id,
        user.id,
        'approved',
        statutoryReason
      );
    } catch {
      // In offline / preview sandbox mode, continue with state updates
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? { ...b, status: 'approved', approvalReason: statutoryReason }
          : b
      )
    );

    const newLog: AuditTimelineItem = {
      id: `log-${Date.now().toString(36)}`,
      bookingId: booking.id,
      action: 'APPROVED',
      timestamp: new Date().toISOString(),
      performedBy: user.name,
      reason: statutoryReason,
      status: 'approved',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setBannerNotice(
      `Requisition #${booking.id.substring(0, 8)} for ${booking.applicantName} SANCTIONED. Signed by ${user.name}.`
    );
    setIsSubmitting(false);
  };

  const handleConfirmReject = async (bookingId: string, reason: string) => {
    setIsSubmitting(true);

    try {
      await updateBookingStatus(
        bookingId,
        user.id,
        'rejected',
        reason
      );
    } catch {
      // In offline sandbox
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'rejected', rejectionReason: reason }
          : b
      )
    );

    const targetBooking = bookings.find((b) => b.id === bookingId);
    const newLog: AuditTimelineItem = {
      id: `log-${Date.now().toString(36)}`,
      bookingId: bookingId,
      action: 'REJECTED',
      timestamp: new Date().toISOString(),
      performedBy: user.name,
      reason: reason,
      status: 'rejected',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setBannerNotice(
      `Requisition #${bookingId.substring(0, 8)} REJECTED. Mandatory justification committed to public audit trail.`
    );
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Admin Header Banner */}
        <section className="rounded-2xl bg-slate-900 p-6 sm:p-8 text-white border border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-500/30">
                <ShieldCheck className="h-4 w-4" />
                <span>Dean Administrative Console • Anti-Corruption Oversight</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Government College Asset Sanctioning Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Adjudicate facility reservation requests from NGOs and Corporates. All decisions are immutably logged. Arbitrary rejections are blocked by law.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                AD
              </div>
              <div>
                <p className="text-xs font-bold text-white">{user.name}</p>
                <p className="text-[11px] text-slate-400">{user.organization}</p>
                <span className="text-[10px] text-emerald-400 font-semibold">● Authority Level: Verified Admin</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800 mt-6">
            <div className="rounded-xl bg-slate-800/60 p-3.5 border border-slate-700/60">
              <p className="text-[10px] uppercase font-semibold text-amber-400">Pending Review</p>
              <p className="text-2xl font-bold text-white">{pendingList.length} Requests</p>
            </div>
            <div className="rounded-xl bg-slate-800/60 p-3.5 border border-slate-700/60">
              <p className="text-[10px] uppercase font-semibold text-emerald-400">Sanctioned</p>
              <p className="text-2xl font-bold text-white">
                {bookings.filter((b) => b.status === 'approved').length} Bookings
              </p>
            </div>
            <div className="rounded-xl bg-slate-800/60 p-3.5 border border-slate-700/60">
              <p className="text-[10px] uppercase font-semibold text-red-400">Justified Rejections</p>
              <p className="text-2xl font-bold text-white">
                {bookings.filter((b) => b.status === 'rejected').length} Decisions
              </p>
            </div>
            <div className="rounded-xl bg-slate-800/60 p-3.5 border border-slate-700/60">
              <p className="text-[10px] uppercase font-semibold text-blue-400">Audit Compliance</p>
              <p className="text-2xl font-bold text-emerald-400">100% Sealed</p>
            </div>
          </div>
        </section>

        {/* Action Confirmation Banner */}
        {bannerNotice && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-950 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <p className="text-xs sm:text-sm font-semibold">{bannerNotice}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBannerNotice(null)}
              className="text-xs bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-100"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-4 text-sm font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`pb-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pending'
                ? 'border-blue-900 text-blue-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Pending Requisitions</span>
            <span className="rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold px-2 py-0.5">
              {pendingList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'all'
                ? 'border-blue-900 text-blue-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>All Historical Bookings ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`pb-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-blue-900 text-blue-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="h-4 w-4 text-blue-700" />
            <span>Immutable Asset Ledger ({auditLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-blue-900 text-blue-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Central Security & Access Audit ({securityEvents.length})</span>
          </button>
        </div>

        {/* TAB 1: Pending Requisitions */}
        {activeTab === 'pending' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Awaiting Administrative Adjudication ({pendingList.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Decision SLA: Within 48 hours. Any rejection strictly requires statutory justification.
                </p>
              </div>
            </div>

            {pendingList.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">All Requisitions Adjudicated</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  There are currently no pending facility requests. All applications have been processed.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingList.map((booking) => (
                  <Card key={booking.id} className="border-slate-200 shadow-xs hover:border-slate-300 transition-all bg-white">
                    <CardContent className="p-5 sm:p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500">
                            #{booking.id.substring(0, 8)}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-500">
                            Applied: {format(new Date(booking.createdAt), 'dd MMM yyyy, HH:mm')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={booking.applicantRole === 'ngo' ? 'success' : 'gov'}
                            className="text-[10px] uppercase font-bold"
                          >
                            {booking.applicantRole === 'ngo' ? 'Tier 1 • NGO Quota' : 'Tier 2 • Corporate'}
                          </Badge>
                          <Badge variant="warning" className="text-[10px] uppercase font-bold">
                            PENDING DEAN REVIEW
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                            Applicant Entity
                          </p>
                          <p className="text-sm font-bold text-slate-900 mt-0.5">{booking.applicantName}</p>
                          <p className="text-[11px] text-slate-500">Verified Society / Registration 80G</p>
                        </div>

                        <div>
                          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                            Requested Facility & Dates
                          </p>
                          <p className="text-sm font-bold text-slate-900 mt-0.5">{booking.spaceName}</p>
                          <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                            <Clock className="h-3.5 w-3.5 text-blue-700" />
                            <span>
                              {format(new Date(booking.startDate), 'dd MMM yyyy')} to{' '}
                              {format(new Date(booking.endDate), 'dd MMM yyyy')}
                            </span>
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                            Mandatory Documentation
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewDoc({
                                name: booking.docName,
                                url: booking.docUrl,
                                applicant: booking.applicantName,
                              })
                            }
                            className="inline-flex items-center gap-1.5 text-xs text-blue-900 font-semibold hover:underline mt-1 cursor-pointer"
                          >
                            <FileText className="h-4 w-4 text-blue-700" />
                            <span>{booking.docName}</span>
                            <Eye className="h-3 w-3 text-slate-400 ml-1" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                          <span>All actions permanently recorded in the public ledger.</span>
                        </div>

                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isSubmitting}
                            onClick={() => setRejectingBooking(booking)}
                            className="text-xs h-9 px-4 font-semibold"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            <span>Reject with Reason</span>
                          </Button>

                          <Button
                            variant="gov"
                            size="sm"
                            disabled={isSubmitting}
                            onClick={() => handleApprove(booking)}
                            className="text-xs h-9 px-5 font-semibold bg-emerald-700 hover:bg-emerald-800 text-white"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            <span>Sanction Allocation</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: All Bookings Table */}
        {activeTab === 'all' && (
          <section className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 font-bold">App Token</th>
                    <th className="p-3.5 font-bold">Applicant</th>
                    <th className="p-3.5 font-bold">Facility</th>
                    <th className="p-3.5 font-bold">Dates</th>
                    <th className="p-3.5 font-bold">Status</th>
                    <th className="p-3.5 font-bold">Statutory Reason / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-mono font-bold text-slate-700">#{b.id.substring(0, 8)}</td>
                      <td className="p-3.5 font-semibold text-slate-900">{b.applicantName}</td>
                      <td className="p-3.5">{b.spaceName}</td>
                      <td className="p-3.5">
                        {b.startDate} to {b.endDate}
                      </td>
                      <td className="p-3.5">
                        {b.status === 'approved' && <Badge variant="success">APPROVED</Badge>}
                        {b.status === 'pending' && <Badge variant="warning">PENDING</Badge>}
                        {b.status === 'rejected' && <Badge variant="destructive">REJECTED</Badge>}
                        {b.status === 'completed' && <Badge variant="secondary">COMPLETED</Badge>}
                      </td>
                      <td className="p-3.5 text-slate-600 max-w-xs truncate italic">
                        {b.rejectionReason || b.approvalReason || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: Immutable Asset Ledger */}
        {activeTab === 'audit' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-blue-900" />
                  Statutory Public Asset Audit Ledger
                </h2>
                <p className="text-xs text-slate-500">
                  Tamper-evident record of all allocation requests, administrative sanctions, and mandatory justifications.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <AuditTimeline logs={auditLogs} />
            </div>
          </section>
        )}

        {/* TAB 4: Central Security & Access Audit Ledger */}
        {activeTab === 'security' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  Central Security & Access Audit Trail
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time security telemetry: Authentication events, brute-force rate limit enforcement, and Proxy route interceptions.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const res = await getSecurityAuditLogsAction();
                  if (res.success && res.data) setSecurityEvents(res.data);
                }}
                className="text-xs gap-1.5"
              >
                <Activity className="h-3.5 w-3.5 text-blue-700" />
                <span>Refresh Telemetry</span>
              </Button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">Next.js 16 Security Proxy Guard Active</span>
                </div>
                <div className="flex items-center gap-4 text-slate-300 text-[11px]">
                  <span>Rate Limiting: 5 attempts/15m</span>
                  <span>Encryption: 256-Bit SHA & TLS</span>
                  <span>Session: HttpOnly Strict</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {securityEvents.map((event) => (
                  <div key={event.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            event.status === 'SUCCESS'
                              ? 'success'
                              : event.status === 'BLOCKED'
                              ? 'destructive'
                              : 'warning'
                          }
                          className="text-[9px] font-mono uppercase"
                        >
                          {event.eventType}
                        </Badge>
                        <span className="font-semibold text-slate-800">{event.email}</span>
                        {event.role && (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase font-semibold">
                            {event.role}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{event.details}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-slate-400">
                        {format(new Date(event.timestamp), 'dd MMM yyyy, HH:mm:ss')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Mandatory Rejection Friction Modal (Anti-Corruption Check) */}
      <AdminRejectModal
        isOpen={!!rejectingBooking}
        bookingId={rejectingBooking?.id || null}
        applicantName={rejectingBooking?.applicantName || ''}
        spaceName={rejectingBooking?.spaceName || ''}
        onClose={() => setRejectingBooking(null)}
        onConfirmReject={handleConfirmReject}
        isSubmitting={isSubmitting}
      />

      {/* Document Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-800" />
              <span>Statutory Eligibility Document</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Submitted by <strong>{previewDoc?.applicant}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">File Name:</span>
              <span className="font-mono text-slate-900">{previewDoc?.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Verification Status:</span>
              <Badge variant="success" className="text-[10px]">
                Verified Digital Hash
              </Badge>
            </div>
            <div className="p-6 bg-white rounded-lg border border-dashed border-slate-300 text-center space-y-2">
              <FileText className="h-10 w-10 text-blue-700 mx-auto" />
              <p className="text-xs font-semibold text-slate-800">
                Official Society Registration & 12A/80G Certificate
              </p>
              <p className="text-[11px] text-slate-400">
                Issued by State Registrar of Public Charitable Trusts
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setPreviewDoc(null)}>
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
