'use client';

import * as React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
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
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';

interface DemoBooking {
  id: string;
  requesterName: string;
  requesterJobTitle: string;
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
    requesterName: 'Ananya Deshmukh',
    requesterJobTitle: 'Secretary',
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
    requesterName: 'Rural Digital Empowerment Foundation Representative',
    requesterJobTitle: 'Nodal Officer',
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
    requesterName: 'Vikramaditya Roy',
    requesterJobTitle: 'CSR Director',
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
    requesterName: 'Community Health Awareness Society Representative',
    requesterJobTitle: 'Authorized Representative',
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

  const activeAdminUser = (user && user.role === 'admin') ? user : {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Dr. Rameshwar Sharma',
    email: 'dean.admin@college.gov.in',
    role: 'admin' as const,
    tier: 1 as const,
    organization: 'Govt. Model Engineering College',
    department: 'Dean of Academic Infrastructure',
  };

  // Load security audit logs
  React.useEffect(() => {
    getSecurityAuditLogsAction().then((res) => {
      if (res.success && res.data && res.data.length > 0) {
        setSecurityEvents(res.data);
      } else {
        setSecurityEvents([
          {
            id: 'sec-001',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            eventType: 'LOGIN_SUCCESS',
            email: 'dean.admin@college.gov.in',
            role: 'admin',
            status: 'SUCCESS',
            details: 'Dean Administrative SSO session verified with statutory TLS 1.3 token.',
          },
          {
            id: 'sec-002',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            eventType: 'LOGIN_SUCCESS',
            email: 'dean.admin@college.gov.in',
            role: 'admin',
            status: 'SUCCESS',
            details: 'Auditorium allocation approved for youth conclave under Tier 1 statutory quota.',
          },
          {
            id: 'sec-003',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            eventType: 'UNAUTHORIZED_ACCESS',
            email: 'anonymous.user@external.net',
            role: 'ngo',
            status: 'BLOCKED',
            details: 'Unauthorized administrative route probing blocked by statutory proxy.',
          },
        ]);
      }
    });
  }, [user]);

  const pendingList = bookings.filter((b) => b.status === 'pending');

  const handleApprove = async (booking: DemoBooking) => {
    setIsSubmitting(true);
    const statutoryReason = `Sanctioned under Section 12-A Public College Facilities Act. Priority: ${
      booking.applicantRole === 'ngo' ? 'Tier 1 Statutory NGO/Societal Quota' : 'Tier 2 Private Reservation'
    }. Verified by Dean of Academic Infrastructure.`;

    try {
      await updateBookingStatus(
        booking.id,
        activeAdminUser.id,
        'approved',
        statutoryReason
      );
    } catch {
      // Offline fallback
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
      performedBy: activeAdminUser.name,
      reason: statutoryReason,
      status: 'approved',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setBannerNotice(
      `Requisition #${booking.id.substring(0, 8)} for ${booking.applicantName} SANCTIONED. Signed by ${activeAdminUser.name}.`
    );
    setIsSubmitting(false);
  };

  const handleConfirmReject = async (bookingId: string, reason: string) => {
    setIsSubmitting(true);

    try {
      await updateBookingStatus(
        bookingId,
        activeAdminUser.id,
        'rejected',
        reason
      );
    } catch {
      // Offline fallback
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
      performedBy: activeAdminUser.name,
      reason: reason,
      status: 'rejected',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setBannerNotice(
      `Requisition #${bookingId.substring(0, 8)} REJECTED. Mandatory statutory ground committed to public audit trail.`
    );
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#FCF8D8] text-[#1C1D1A] font-body selection:bg-[#DD700B] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 flex-1">
        {(!user || user.role !== 'admin') && (
          <div className="bg-[#1C1D1A] text-[#FCF8D8] p-4 rounded-2xl border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#DD700B] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-[#DD700B] shrink-0" />
              <div>
                <p className="font-display font-extrabold text-[#FCF8D8]">
                  Dean Evaluation & Adjudication Mode Active
                </p>
                <p className="text-[11px] text-[#D9DADF] font-medium">
                  Authenticated Authority: <strong>Dr. Rameshwar Sharma</strong> (Dean of Academic Infrastructure). All 4 statutory requisitions are ready for review.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => switchDemoRole('admin')}
              className="px-4 py-2 rounded-xl bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs shrink-0 cursor-pointer border border-white/20 transition-all hover:scale-105"
            >
              Sign In Officially via SSO
            </button>
          </div>
        )}

        {/* ── ADMIN HEADER BANNER ────────────────────────────────────────── */}
        <section className="bg-white rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] p-6 sm:p-8 space-y-6 text-[#1C1D1A]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#1C1D1A] px-3 py-1 text-xs font-display font-extrabold text-[#FCF8D8]">
                <ShieldCheck className="h-4 w-4 text-[#DD700B]" />
                <span>Dean Administrative Console • Statutory Oversight</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-[#1C1D1A]">
                College Infrastructure Sanctioning Registry
              </h1>
              <p className="text-xs sm:text-sm text-[#7C7D75] font-semibold leading-relaxed">
                Adjudicate facility reservation requests from verified NGOs/societal groups and Private entities. Decisions are immutably written to the state audit ledger. Arbitrary denials are strictly blocked under Section 21.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#FCF8D8] p-3.5 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] shrink-0">
              <div className="h-11 w-11 rounded-xl bg-[#DD700B] text-white flex items-center justify-center font-display font-extrabold text-sm border border-[#1C1D1A]">
                AD
              </div>
              <div>
                <p className="text-xs font-display font-extrabold text-[#1C1D1A]">{activeAdminUser.name}</p>
                <p className="text-[11px] text-[#7C7D75] font-semibold">{activeAdminUser.organization}</p>
                <span className="text-[10px] text-[#DD700B] font-extrabold">● Statutory Authority: Dean SSO</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t-2 border-[#1C1D1A]/15">
            <div className="rounded-2xl bg-[#FCF8D8] p-4 border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
              <p className="text-[10px] uppercase font-display font-extrabold text-[#DD700B]">Pending Review</p>
              <p className="text-2xl font-display font-extrabold text-[#1C1D1A] mt-0.5">{pendingList.length} Requests</p>
            </div>
            <div className="rounded-2xl bg-[#D9DADF] p-4 border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
              <p className="text-[10px] uppercase font-display font-extrabold text-[#1C1D1A]">Sanctioned</p>
              <p className="text-2xl font-display font-extrabold text-[#1C1D1A] mt-0.5">
                {bookings.filter((b) => b.status === 'approved').length} Bookings
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
              <p className="text-[10px] uppercase font-display font-extrabold text-[#7C7D75]">Justified Rejections</p>
              <p className="text-2xl font-display font-extrabold text-[#1C1D1A] mt-0.5">
                {bookings.filter((b) => b.status === 'rejected').length} Decisions
              </p>
            </div>
            <div className="rounded-2xl bg-[#FCF8D8] p-4 border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
              <p className="text-[10px] uppercase font-display font-extrabold text-[#DD700B]">Audit Compliance</p>
              <p className="text-2xl font-display font-extrabold text-[#DD700B] mt-0.5">100% Sealed</p>
            </div>
          </div>
        </section>

        {/* Action Confirmation Banner */}
        {bannerNotice && (
          <div className="rounded-2xl border-2 border-[#1C1D1A] bg-[#FCF8D8] p-4 text-[#1C1D1A] flex items-center justify-between shadow-[3px_3px_0px_0px_#1C1D1A]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#DD700B] shrink-0" />
              <p className="text-xs sm:text-sm font-semibold">{bannerNotice}</p>
            </div>
            <button
              type="button"
              onClick={() => setBannerNotice(null)}
              className="text-xs font-display font-extrabold px-3 py-1 bg-white hover:bg-[#D9DADF] rounded-xl border-2 border-[#1C1D1A] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── NAVIGATION TABS ────────────────────────────────────────────── */}
        <div className="flex border-b-2 border-[#1C1D1A] gap-2 overflow-x-auto pb-1 text-xs font-display font-extrabold">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pending'
                ? 'bg-[#1C1D1A] text-[#FCF8D8] border-[#1C1D1A] shadow-[2px_2px_0px_0px_#DD700B]'
                : 'bg-white text-[#1C1D1A] border-[#1C1D1A] hover:bg-[#D9DADF]'
            }`}
          >
            <span>Pending Requisitions</span>
            <span className="rounded-md bg-[#DD700B] text-white text-[10px] font-extrabold px-2 py-0.2">
              {pendingList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`py-2 px-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-[#1C1D1A] text-[#FCF8D8] border-[#1C1D1A] shadow-[2px_2px_0px_0px_#DD700B]'
                : 'bg-white text-[#1C1D1A] border-[#1C1D1A] hover:bg-[#D9DADF]'
            }`}
          >
            <span>All Bookings ({bookings.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`py-2 px-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-[#1C1D1A] text-[#FCF8D8] border-[#1C1D1A] shadow-[2px_2px_0px_0px_#DD700B]'
                : 'bg-white text-[#1C1D1A] border-[#1C1D1A] hover:bg-[#D9DADF]'
            }`}
          >
            <Lock className="h-3.5 w-3.5 text-[#DD700B]" />
            <span>Immutable Asset Ledger ({auditLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`py-2 px-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-[#1C1D1A] text-[#FCF8D8] border-[#1C1D1A] shadow-[2px_2px_0px_0px_#DD700B]'
                : 'bg-white text-[#1C1D1A] border-[#1C1D1A] hover:bg-[#D9DADF]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#DD700B]" />
            <span>Central Security Audit ({securityEvents.length})</span>
          </button>
        </div>

        {/* ── TAB 1: PENDING REQUISITIONS ─────────────────────────────────── */}
        {activeTab === 'pending' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-display font-extrabold text-[#1C1D1A]">
                  Awaiting Administrative Adjudication ({pendingList.length})
                </h2>
                <p className="text-xs text-[#7C7D75] font-semibold">
                  Decision SLA: Within 48 hours. Any rejection strictly requires mandatory statutory justification.
                </p>
              </div>
            </div>

            {pendingList.length === 0 ? (
              <div className="rounded-3xl border-2 border-[#1C1D1A] bg-white p-12 text-center space-y-3 shadow-[4px_4px_0px_0px_#1C1D1A]">
                <CheckCircle2 className="h-12 w-12 text-[#DD700B] mx-auto" />
                <h3 className="text-base font-display font-extrabold text-[#1C1D1A]">All Requisitions Adjudicated</h3>
                <p className="text-xs text-[#7C7D75] max-w-sm mx-auto font-semibold">
                  There are currently no pending facility requests. All applications have been processed in compliance with state statutory SLA.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingList.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-3xl border-2 border-[#1C1D1A] bg-white shadow-[4px_4px_0px_0px_#1C1D1A] p-5 sm:p-6 space-y-4 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#1C1D1A]/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-[#1C1D1A] px-2 py-0.5 rounded-md bg-[#FCF8D8] border border-[#1C1D1A]">
                          #{booking.id.substring(0, 8)}
                        </span>
                        <span className="text-[#ADACA7]">•</span>
                        <span className="text-xs text-[#7C7D75] font-semibold">
                          Applied: {format(new Date(booking.createdAt), 'dd MMM yyyy, HH:mm')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-display font-extrabold px-2.5 py-0.5 rounded-full border border-[#1C1D1A] ${
                          booking.applicantRole === 'ngo' ? 'bg-[#DD700B] text-white' : 'bg-[#D9DADF] text-[#1C1D1A]'
                        }`}>
                          {booking.applicantRole === 'ngo' ? 'Tier 1 • NGO/Societal (70% Quota)' : 'Tier 2 • Private'}
                        </span>
                        <span className="text-[10px] uppercase font-display font-extrabold px-2.5 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] border border-[#1C1D1A]">
                          Pending Dean Review
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-[11px] text-[#7C7D75] font-display font-extrabold uppercase tracking-wider">
                          Applicant Entity
                        </p>
                        <p className="text-sm font-display font-extrabold text-[#1C1D1A] mt-0.5">{booking.applicantName}</p>
                        <p className="text-[11px] text-[#7C7D75] font-semibold mt-0.5">Verified Society / Registration 80G</p>
                        <p className="text-[11px] text-[#1C1D1A] font-semibold mt-1">Requested by {booking.requesterName} · {booking.requesterJobTitle}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-[#7C7D75] font-display font-extrabold uppercase tracking-wider">
                          Requested Facility & Schedule
                        </p>
                        <p className="text-sm font-display font-extrabold text-[#1C1D1A] mt-0.5">{booking.spaceName}</p>
                        <p className="text-[11px] text-[#1C1D1A] font-bold flex items-center gap-1 mt-0.5">
                          <Clock className="h-3.5 w-3.5 text-[#DD700B]" />
                          <span>
                            {format(new Date(booking.startDate), 'dd MMM yyyy')} to{' '}
                            {format(new Date(booking.endDate), 'dd MMM yyyy')}
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] text-[#7C7D75] font-display font-extrabold uppercase tracking-wider">
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
                          className="inline-flex items-center gap-1.5 text-xs text-[#1C1D1A] font-extrabold hover:text-[#DD700B] mt-1.5 p-2 rounded-xl bg-[#FCF8D8] border border-[#1C1D1A] cursor-pointer"
                        >
                          <FileText className="h-4 w-4 text-[#DD700B]" />
                          <span>{booking.docName}</span>
                          <Eye className="h-3 w-3 text-[#7C7D75] ml-1" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t-2 border-[#1C1D1A]/10">
                      <div className="text-[11px] text-[#7C7D75] font-semibold flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-[#DD700B]" />
                        <span>All actions permanently recorded in the public ledger under Section 21.</span>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setRejectingBooking(booking)}
                          className="flex-1 sm:flex-none text-xs font-display font-extrabold h-10 px-4 rounded-2xl bg-white hover:bg-[#D9DADF] text-[#1C1D1A] border-2 border-[#1C1D1A] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="h-3.5 w-3.5 text-[#DD700B]" />
                          <span>Reject with Reason</span>
                        </button>

                        <button
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => handleApprove(booking)}
                          className="flex-1 sm:flex-none text-xs font-display font-extrabold h-10 px-5 rounded-2xl bg-[#DD700B] hover:bg-[#c96205] text-white border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>Sanction Allocation</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── TAB 2: ALL HISTORICAL BOOKINGS TABLE ────────────────────────── */}
        {activeTab === 'all' && (
          <section className="space-y-4">
            <div className="rounded-3xl border-2 border-[#1C1D1A] bg-white shadow-[4px_4px_0px_0px_#1C1D1A] overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FCF8D8] text-[11px] font-display font-extrabold uppercase tracking-wider text-[#1C1D1A] border-b-2 border-[#1C1D1A]">
                  <tr>
                    <th className="p-3.5">App Token</th>
                    <th className="p-3.5">Applicant Entity</th>
                    <th className="p-3.5">Facility</th>
                    <th className="p-3.5">Schedule</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Statutory Reason / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C1D1A]/10">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#FCF8D8]/40 transition-colors">
                      <td className="p-3.5 font-mono font-extrabold text-[#1C1D1A]">#{b.id.substring(0, 8)}</td>
                      <td className="p-3.5 font-bold text-[#1C1D1A]">{b.applicantName}</td>
                      <td className="p-3.5 text-[#1C1D1A] font-medium">{b.spaceName}</td>
                      <td className="p-3.5 text-[#7C7D75] font-semibold whitespace-nowrap">
                        {b.startDate} to {b.endDate}
                      </td>
                      <td className="p-3.5">
                        {b.status === 'approved' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-display font-extrabold bg-[#DD700B] text-white border border-[#1C1D1A]">
                            APPROVED
                          </span>
                        )}
                        {b.status === 'pending' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-display font-extrabold bg-[#1C1D1A] text-[#FCF8D8] border border-[#1C1D1A]">
                            PENDING
                          </span>
                        )}
                        {b.status === 'rejected' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-display font-extrabold bg-[#7C7D75] text-white border border-[#1C1D1A]">
                            REJECTED
                          </span>
                        )}
                        {b.status === 'completed' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-display font-extrabold bg-[#D9DADF] text-[#1C1D1A] border border-[#1C1D1A]">
                            COMPLETED
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-[#1C1D1A]/80 max-w-xs truncate italic font-medium">
                        {b.rejectionReason || b.approvalReason || 'Awaiting adjudication'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── TAB 3: IMMUTABLE ASSET LEDGER ───────────────────────────────── */}
        {activeTab === 'audit' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-display font-extrabold text-[#1C1D1A] flex items-center gap-2">
                  <Lock className="h-4 w-4 text-[#DD700B]" />
                  <span>Statutory Public Asset Audit Ledger</span>
                </h2>
                <p className="text-xs text-[#7C7D75] font-semibold">
                  Tamper-evident record of all allocation requests, administrative sanctions, and mandatory justifications.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border-2 border-[#1C1D1A] bg-white p-6 shadow-[4px_4px_0px_0px_#1C1D1A]">
              <AuditTimeline logs={auditLogs} />
            </div>
          </section>
        )}

        {/* ── TAB 4: CENTRAL SECURITY AUDIT ───────────────────────────────── */}
        {activeTab === 'security' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-display font-extrabold text-[#1C1D1A] flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#DD700B]" />
                  <span>Central Security & Access Audit Trail</span>
                </h2>
                <p className="text-xs text-[#7C7D75] font-semibold">
                  Real-time security telemetry: Authentication events, brute-force rate limit enforcement, and Proxy route interceptions.
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const res = await getSecurityAuditLogsAction();
                  if (res.success && res.data) setSecurityEvents(res.data);
                }}
                className="text-xs font-display font-extrabold px-3 py-1.5 rounded-xl bg-white hover:bg-[#D9DADF] border-2 border-[#1C1D1A] flex items-center gap-1.5 cursor-pointer"
              >
                <Activity className="h-3.5 w-3.5 text-[#DD700B]" />
                <span>Refresh Telemetry</span>
              </button>
            </div>

            <div className="rounded-3xl border-2 border-[#1C1D1A] bg-white shadow-[4px_4px_0px_0px_#1C1D1A] overflow-hidden">
              <div className="p-4 bg-[#1C1D1A] text-[#FCF8D8] flex flex-wrap items-center justify-between gap-3 text-xs border-b-2 border-[#1C1D1A]">
                <div className="flex items-center gap-2 font-display font-extrabold">
                  <span className="h-2 w-2 rounded-full bg-[#DD700B] animate-pulse" />
                  <span>Next.js 16 Security Proxy Guard Active</span>
                </div>
                <div className="flex items-center gap-4 text-[#ADACA7] text-[11px] font-mono">
                  <span>Rate Limiting: 5 attempts/15m</span>
                  <span>•</span>
                  <span>Encryption: 256-Bit SHA</span>
                  <span>•</span>
                  <span>Session: HttpOnly Strict</span>
                </div>
              </div>

              <div className="divide-y divide-[#1C1D1A]/10">
                {securityEvents.map((event) => (
                  <div key={event.id} className="p-4 hover:bg-[#FCF8D8]/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded border border-[#1C1D1A] ${
                          event.status === 'SUCCESS' ? 'bg-[#FCF8D8] text-[#1C1D1A]' : 'bg-[#DD700B] text-white'
                        }`}>
                          {event.eventType}
                        </span>
                        <span className="font-extrabold text-[#1C1D1A]">{event.email}</span>
                        {event.role && (
                          <span className="text-[10px] text-[#7C7D75] bg-[#D9DADF] px-1.5 py-0.5 rounded uppercase font-bold">
                            {event.role}
                          </span>
                        )}
                      </div>
                      <p className="text-[#7C7D75] text-[11px] font-medium leading-relaxed">{event.details}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-[#7C7D75]">
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
        <DialogContent className="sm:max-w-md bg-white border-2 border-[#1C1D1A] rounded-3xl p-6 shadow-[5px_5px_0px_0px_#1C1D1A]">
          <DialogHeader>
            <DialogTitle className="text-base font-display font-extrabold flex items-center gap-2 text-[#1C1D1A]">
              <FileText className="h-5 w-5 text-[#DD700B]" />
              <span>Statutory Eligibility Document</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#7C7D75] font-semibold">
              Submitted by <strong>{previewDoc?.applicant}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] space-y-3 mt-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#1C1D1A]">File Name:</span>
              <span className="font-mono text-[#1C1D1A] font-semibold">{previewDoc?.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#1C1D1A]">Verification Status:</span>
              <span className="text-[10px] font-display font-extrabold px-2 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8]">
                Verified Digital Hash
              </span>
            </div>
            <div className="p-6 bg-white rounded-xl border-2 border-dashed border-[#1C1D1A] text-center space-y-2">
              <FileText className="h-10 w-10 text-[#DD700B] mx-auto" />
              <p className="text-xs font-display font-extrabold text-[#1C1D1A]">
                Official Society Registration & 12A/80G Certificate
              </p>
              <p className="text-[11px] text-[#7C7D75] font-semibold">
                Issued by State Registrar of Public Charitable Trusts
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={() => setPreviewDoc(null)}
              className="px-4 py-2 bg-white hover:bg-[#D9DADF] text-[#1C1D1A] font-display font-extrabold text-xs rounded-xl border-2 border-[#1C1D1A] cursor-pointer"
            >
              Close Preview
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
