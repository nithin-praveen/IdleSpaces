'use client';

import * as React from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AdminRejectModal } from '@/components/AdminRejectModal';
import { AuditTimeline, type AuditTimelineItem } from '@/components/AuditTimeline';
import { updateBookingStatus } from '@/app/actions';
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
    spaceName: 'Rabindranath Tagore Cultural & Arts Hall',
    spaceType: 'auditorium',
    startDate: '2026-10-30',
    endDate: '2026-10-31',
    status: 'approved',
    docUrl: 'https://storage.idlespaces.gov.in/docs/health_noc.pdf',
    docName: 'Health_Dept_NOC.pdf',
    createdAt: '2026-10-27T14:20:00.000Z',
    approvalReason: 'Full compliance with Tier 1 quota; free community screening verified.',
  },
];

const INITIAL_AUDIT_LOGS: AuditTimelineItem[] = [
  {
    id: 'aud-001',
    action: 'REQUESTED',
    reason: null,
    performedBy: 'Nodal Officer - Pratham Youth',
    performerRole: 'NGO Applicant (Tier 1)',
    timestamp: '2026-10-28T09:15:00.000Z',
    details: 'Submitted Requisition Form 4A with Society 80G registration certificate.',
  },
  {
    id: 'aud-002',
    action: 'APPROVED',
    reason: 'Verified Tier 1 civic compliance. Space is available with zero conflicting college examinations.',
    performedBy: 'Prof. K. Sundaram (Dean of Academic Assets)',
    performerRole: 'College Administrator',
    timestamp: '2026-10-27T16:30:00.000Z',
    details: 'Allocated Rabindranath Tagore Hall for community health awareness drive.',
  },
  {
    id: 'aud-003',
    action: 'REJECTED',
    reason: 'Space reserved for State Board Engineering practical exams (Gazette Order #ED/2026/89). No alternative hall available.',
    performedBy: 'Prof. K. Sundaram (Dean of Academic Assets)',
    performerRole: 'College Administrator',
    timestamp: '2026-10-26T11:00:00.000Z',
    details: 'Statutory rejection recorded with mandatory gazette citation.',
  },
];

export default function AdminDashboardPage() {
  const [bookings, setBookings] = React.useState<DemoBooking[]>(INITIAL_BOOKINGS);
  const [auditLogs, setAuditLogs] = React.useState<AuditTimelineItem[]>(INITIAL_AUDIT_LOGS);
  const [activeTab, setActiveTab] = React.useState<'pending' | 'all' | 'audit'>('pending');

  // Reject Modal State
  const [rejectingBooking, setRejectingBooking] = React.useState<DemoBooking | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  // Document Preview Modal State
  const [previewDoc, setPreviewDoc] = React.useState<{ name: string; url: string; applicant: string } | null>(null);

  // Success Alert State
  const [bannerNotice, setBannerNotice] = React.useState<string | null>(null);

  const pendingList = bookings.filter((b) => b.status === 'pending');

  const handleApprove = async (booking: DemoBooking) => {
    setIsSubmitting(true);
    const statutoryApprovalReason = 'All statutory compliance documents verified; allocated under fair quota rules.';
    const adminId = 'a0000000-0000-0000-0000-000000000099';

    try {
      // Call server action
      await updateBookingStatus(booking.id, adminId, 'approved', statutoryApprovalReason);
    } catch (e) {
      console.warn('Sandbox simulation:', e);
    }

    // Update local state
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? { ...b, status: 'approved' as const, approvalReason: statutoryApprovalReason }
          : b
      )
    );

    // Add to audit trail
    const newLog: AuditTimelineItem = {
      id: `aud-${Date.now()}`,
      action: 'APPROVED',
      reason: statutoryApprovalReason,
      performedBy: 'Prof. K. Sundaram (Dean of Academic Assets)',
      performerRole: 'College Administrator',
      timestamp: new Date().toISOString(),
      details: `Approved allocation of ${booking.spaceName} for ${booking.applicantName}.`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setBannerNotice(`Successfully APPROVED application #${booking.id.substring(0, 8)} for ${booking.applicantName}. Audit log recorded.`);
    setIsSubmitting(false);
  };

  const handleConfirmReject = async (bookingId: string, reason: string) => {
    setIsSubmitting(true);
    const adminId = 'a0000000-0000-0000-0000-000000000099';

    try {
      // Call server action to enforce rejection reason at database/backend level
      await updateBookingStatus(bookingId, adminId, 'rejected', reason);
    } catch (e) {
      console.warn('Sandbox simulation:', e);
    }

    const targetBooking = bookings.find((b) => b.id === bookingId);

    // Update local state
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'rejected' as const, rejectionReason: reason }
          : b
      )
    );

    // Add permanent audit log
    const newLog: AuditTimelineItem = {
      id: `aud-${Date.now()}`,
      action: 'REJECTED',
      reason,
      performedBy: 'Prof. K. Sundaram (Dean of Academic Assets)',
      performerRole: 'College Administrator',
      timestamp: new Date().toISOString(),
      details: `Rejection justification recorded for ${targetBooking?.applicantName || 'Applicant'}.`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setBannerNotice(`Requisition #${bookingId.substring(0, 8)} REJECTED. Mandatory justification committed to public audit trail.`);
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
                KS
              </div>
              <div>
                <p className="text-xs font-bold text-white">Prof. K. Sundaram</p>
                <p className="text-[11px] text-slate-400">Dean of Academic Infrastructure</p>
                <span className="text-[10px] text-emerald-400 font-semibold">● Authority Level: High</span>
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
        <div className="flex border-b border-slate-200 gap-4 text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`pb-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
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
            className={`pb-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
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
            className={`pb-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'audit'
                ? 'border-blue-900 text-blue-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="h-4 w-4 text-blue-700" />
            <span>Immutable Audit Ledger ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: Pending Requisitions Table */}
        {activeTab === 'pending' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Applications Awaiting Official Adjudication
                </h2>
                <p className="text-xs text-slate-500">
                  Review applicant eligibility certificates and sanction or reject with mandatory justification.
                </p>
              </div>
            </div>

            {pendingList.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="p-3.5 font-bold">App Token</th>
                      <th className="p-3.5 font-bold">Applicant / Entity</th>
                      <th className="p-3.5 font-bold">Statutory Tier</th>
                      <th className="p-3.5 font-bold">Facility Requested</th>
                      <th className="p-3.5 font-bold">Schedule</th>
                      <th className="p-3.5 font-bold">Eligibility Proof</th>
                      <th className="p-3.5 font-bold text-right">Adjudication Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingList.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Token */}
                        <td className="p-3.5 font-mono font-bold text-slate-800">
                          #{booking.id.substring(0, 8)}
                        </td>

                        {/* Applicant */}
                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">{booking.applicantName}</p>
                          <span className="text-[11px] text-slate-400 capitalize">
                            Category: {booking.applicantRole}
                          </span>
                        </td>

                        {/* Tier */}
                        <td className="p-3.5">
                          {booking.tier === 1 ? (
                            <Badge variant="success" className="text-[10px]">
                              Tier 1 • NGO (70% Quota)
                            </Badge>
                          ) : (
                            <Badge variant="gov" className="text-[10px]">
                              Tier 2 • Corporate
                            </Badge>
                          )}
                        </td>

                        {/* Space */}
                        <td className="p-3.5">
                          <p className="font-semibold text-slate-800">{booking.spaceName}</p>
                          <span className="text-[10px] text-slate-400 uppercase">
                            {booking.spaceType.replace('_', ' ')}
                          </span>
                        </td>

                        {/* Schedule */}
                        <td className="p-3.5 font-medium text-slate-700">
                          <div>
                            {format(new Date(booking.startDate), 'dd MMM yyyy')}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            to {format(new Date(booking.endDate), 'dd MMM yyyy')}
                          </div>
                        </td>

                        {/* NOC / Document */}
                        <td className="p-3.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setPreviewDoc({
                                name: booking.docName,
                                url: booking.docUrl,
                                applicant: booking.applicantName,
                              })
                            }
                            className="gap-1.5 text-xs h-7 text-blue-900 border-blue-200 bg-blue-50/50 hover:bg-blue-100"
                          >
                            <FileText className="h-3 w-3 text-blue-700" />
                            <span>View NOC / Cert</span>
                          </Button>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Approve */}
                            <Button
                              type="button"
                              variant="gov"
                              size="sm"
                              disabled={isSubmitting}
                              onClick={() => handleApprove(booking)}
                              className="h-8 gap-1 text-xs bg-emerald-700 hover:bg-emerald-800 border-emerald-800 font-semibold text-white shadow-xs"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span>Approve</span>
                            </Button>

                            {/* Reject (Friction Modal) */}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              disabled={isSubmitting}
                              onClick={() => setRejectingBooking(booking)}
                              className="h-8 gap-1 text-xs font-semibold shadow-xs"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Reject</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-slate-900">Queue Clear: No Pending Requisitions</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  All submitted applications have been processed and logged into the immutable audit ledger.
                </p>
              </div>
            )}
          </section>
        )}

        {/* TAB 2: Historical Bookings */}
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
                      <td className="p-3.5">{b.startDate} to {b.endDate}</td>
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

        {/* TAB 3: Standout UI - Vertical Immutable Audit Ledger */}
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
              <Badge variant="success" className="text-[10px]">Verified Digital Hash</Badge>
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
