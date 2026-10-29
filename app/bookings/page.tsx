'use client';

import * as React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ConditionReportModal } from '@/components/ConditionReportModal';
import type { ReportPhase } from '@/types/database';
import {
  CalendarCheck2,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight,
  MapPin,
  Eye,
  ArrowUpRight,
} from 'lucide-react';
import { format } from 'date-fns';

interface UserBooking {
  id: string;
  spaceName: string;
  spaceType: 'auditorium' | 'computer_lab' | 'ground';
  location: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'completed';
  securityDeposit: number;
  depositStatus: 'escrowed' | 'released' | 'withheld';
  checkInReport?: {
    photoUrl: string;
    timestamp: string;
    notes: string;
  };
  checkOutReport?: {
    photoUrl: string;
    timestamp: string;
    notes: string;
    damageReported: boolean;
  };
}

const INITIAL_USER_BOOKINGS: UserBooking[] = [
  {
    id: 'b1111111-2222-3333-4444-555555555001',
    spaceName: 'Sardar Vallabhbhai Patel Central Auditorium',
    spaceType: 'auditorium',
    location: 'North Administrative Quad, Floor 1',
    startDate: '2026-10-28',
    endDate: '2026-10-29',
    status: 'approved',
    securityDeposit: 10000,
    depositStatus: 'escrowed',
  },
  {
    id: 'b1111111-2222-3333-4444-555555555004',
    spaceName: 'Rabindranath Tagore Cultural & Performing Arts Hall',
    spaceType: 'auditorium',
    location: 'Fine Arts Pavilion, Block C',
    startDate: '2026-10-20',
    endDate: '2026-10-21',
    status: 'completed',
    securityDeposit: 5000,
    depositStatus: 'released',
    checkInReport: {
      photoUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
      timestamp: '2026-10-20T08:30:00.000Z',
      notes: 'Initial check: stage and seating clean, audio board verified operational.',
    },
    checkOutReport: {
      photoUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      timestamp: '2026-10-21T18:00:00.000Z',
      notes: 'Event completed. Trash cleared, all chairs reset, AV cables stored properly.',
      damageReported: false,
    },
  },
];

export default function MyBookingsPage() {
  const [bookings, setBookings] = React.useState<UserBooking[]>(INITIAL_USER_BOOKINGS);

  const [modalConfig, setModalConfig] = React.useState<{
    isOpen: boolean;
    bookingId: string | null;
    spaceName: string;
    phase: ReportPhase;
  }>({
    isOpen: false,
    bookingId: null,
    spaceName: '',
    phase: 'check-in',
  });

  const [comparisonBooking, setComparisonBooking] = React.useState<UserBooking | null>(
    INITIAL_USER_BOOKINGS.find((b) => b.checkInReport && b.checkOutReport) || null
  );

  const handleOpenConditionModal = (booking: UserBooking, phase: ReportPhase) => {
    setModalConfig({
      isOpen: true,
      bookingId: booking.id,
      spaceName: booking.spaceName,
      phase,
    });
  };

  const handleConditionSuccess = (
    bookingId: string,
    phase: ReportPhase,
    photoUrl: string,
    notes: string,
    hasDamage: boolean
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;

        if (phase === 'check-in') {
          return {
            ...b,
            checkInReport: {
              photoUrl,
              timestamp: new Date().toISOString(),
              notes,
            },
          };
        } else {
          return {
            ...b,
            status: 'completed' as const,
            depositStatus: hasDamage ? ('withheld' as const) : ('released' as const),
            checkOutReport: {
              photoUrl,
              timestamp: new Date().toISOString(),
              notes,
              damageReported: hasDamage,
            },
          };
        }
      })
    );

    const updated = bookings.find((b) => b.id === bookingId);
    if (updated) {
      setComparisonBooking(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8D8] text-[#1C1D1A] font-body selection:bg-[#DD700B] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Header Banner */}
        <section className="bg-white rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] p-6 sm:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#D9DADF] px-3.5 py-1.5 text-xs font-bold text-[#1C1D1A] border-2 border-[#1C1D1A]">
                <Camera className="h-4 w-4 text-[#DD700B]" />
                <span>Accountability Flow • Pre & Post Event Visual Proof</span>
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1C1D1A] tracking-tight leading-tight">
                My Space Reservations & Inspection Ledger
              </h1>
              <p className="text-xs sm:text-sm text-[#1C1D1A]/85 font-medium leading-relaxed">
                Check-in before your event and submit post-event clean photos. Transparent photo evidence protects your organization and expedites immediate security deposit release.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#FCF8D8] p-4 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
              <div className="h-10 w-10 rounded-xl bg-[#DD700B] text-white flex items-center justify-center font-display font-extrabold text-sm border border-[#1C1D1A]">
                PE
              </div>
              <div>
                <p className="font-display font-extrabold text-xs text-[#1C1D1A]">Pratham Youth Initiative</p>
                <div className="flex items-center gap-1 text-[10px] text-[#7C7D75] font-extrabold">
                  <ShieldCheck className="h-3 w-3 text-[#DD700B]" />
                  <span>Tier 1 Verified NGO • 70% Quota Beneficiary</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Reservations Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-[#1C1D1A] flex items-center gap-2">
              <CalendarCheck2 className="h-5 w-5 text-[#DD700B]" />
              <span>Active Requisitions & Accountability Stages</span>
            </h2>
            <Link href="/discover">
              <button
                type="button"
                className="bg-white hover:bg-[#D9DADF] text-[#1C1D1A] font-display font-extrabold text-xs py-2 px-3.5 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Request Another Facility</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#DD700B]" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((booking) => {
              const hasCheckIn = !!booking.checkInReport;
              const hasCheckOut = !!booking.checkOutReport;

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-3xl border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A] overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-5 pb-3 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md bg-[#1C1D1A] text-[#FCF8D8] border border-[#1C1D1A]">
                            Ref: #{booking.id.substring(0, 8)}
                          </span>
                          <span className="text-[10px] font-display font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#D9DADF] text-[#1C1D1A] border border-[#1C1D1A]">
                            {booking.spaceType.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="font-display font-extrabold text-lg text-[#1C1D1A] mt-2 leading-snug">
                          {booking.spaceName}
                        </h3>
                        <p className="text-xs text-[#7C7D75] font-semibold flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-[#DD700B]" />
                          <span>{booking.location}</span>
                        </p>
                      </div>

                      <div>
                        {booking.status === 'approved' && (
                          <span className="text-xs font-display font-extrabold px-3 py-1 rounded-full bg-[#DD700B] text-white border border-[#1C1D1A]">
                            Approved
                          </span>
                        )}
                        {booking.status === 'completed' && (
                          <span className="text-xs font-display font-extrabold px-3 py-1 rounded-full bg-[#7C7D75] text-[#FCF8D8] border border-[#1C1D1A]">
                            Completed & Sealed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Event Schedule Info */}
                    <div className="flex items-center justify-between rounded-2xl bg-[#FCF8D8] p-3 border-2 border-[#1C1D1A]">
                      <div>
                        <span className="text-[9px] font-extrabold uppercase text-[#7C7D75]">Event Dates</span>
                        <p className="font-display font-extrabold text-xs text-[#1C1D1A] mt-0.5">
                          {booking.startDate} — {booking.endDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-extrabold uppercase text-[#7C7D75]">Security Deposit</span>
                        <p className="font-display font-extrabold text-xs text-[#DD700B] mt-0.5">
                          ₹{booking.securityDeposit.toLocaleString()} ({booking.depositStatus.toUpperCase()})
                        </p>
                      </div>
                    </div>

                    {/* Progress Timeline */}
                    <div className="space-y-2 pt-1">
                      <p className="text-[10px] font-display font-extrabold uppercase tracking-wider text-[#7C7D75]">
                        Event Accountability Flow
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-display font-extrabold">
                        {/* Stage 1: Allocation */}
                        <div className="p-2.5 rounded-xl bg-[#FCF8D8] border-2 border-[#1C1D1A] text-[#1C1D1A]">
                          <CheckCircle2 className="h-4 w-4 mx-auto text-[#DD700B] mb-1" />
                          <span>Sanctioned</span>
                        </div>

                        {/* Stage 2: Pre-Check-in */}
                        <div
                          className={`p-2.5 rounded-xl border-2 border-[#1C1D1A] ${
                            hasCheckIn
                              ? 'bg-[#FCF8D8] text-[#1C1D1A]'
                              : 'bg-[#DD700B] text-white animate-pulse'
                          }`}
                        >
                          {hasCheckIn ? (
                            <CheckCircle2 className="h-4 w-4 mx-auto text-[#DD700B] mb-1" />
                          ) : (
                            <Camera className="h-4 w-4 mx-auto text-white mb-1" />
                          )}
                          <span>{hasCheckIn ? 'Checked-In' : 'Check-In Due'}</span>
                        </div>

                        {/* Stage 3: Post-Check-out */}
                        <div
                          className={`p-2.5 rounded-xl border-2 border-[#1C1D1A] ${
                            hasCheckOut
                              ? 'bg-[#7C7D75] text-[#FCF8D8]'
                              : hasCheckIn
                              ? 'bg-[#D9DADF] text-[#1C1D1A]'
                              : 'bg-white text-[#7C7D75]'
                          }`}
                        >
                          {hasCheckOut ? (
                            <CheckCircle2 className="h-4 w-4 mx-auto text-[#FCF8D8] mb-1" />
                          ) : (
                            <Lock className="h-4 w-4 mx-auto text-[#7C7D75] mb-1" />
                          )}
                          <span>{hasCheckOut ? 'Checked-Out' : 'Check-Out'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-3 border-t-2 border-[#1C1D1A] bg-[#FCF8D8]/70 flex flex-wrap items-center justify-between gap-2">
                    {!hasCheckIn && (
                      <button
                        type="button"
                        onClick={() => handleOpenConditionModal(booking, 'check-in')}
                        className="w-full bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs py-2.5 px-4 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Perform Pre-Event Check-In (Photo Proof)</span>
                      </button>
                    )}

                    {hasCheckIn && !hasCheckOut && (
                      <button
                        type="button"
                        onClick={() => handleOpenConditionModal(booking, 'check-out')}
                        className="w-full bg-[#7C7D75] hover:bg-[#686962] text-[#FCF8D8] font-display font-extrabold text-xs py-2.5 px-4 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
                      >
                        <CheckCircle2 className="h-4 w-4 text-[#DD700B]" />
                        <span>Perform Post-Event Check-Out & Refund Deposit</span>
                      </button>
                    )}

                    {hasCheckIn && hasCheckOut && (
                      <button
                        type="button"
                        onClick={() => setComparisonBooking(booking)}
                        className="w-full bg-white hover:bg-[#D9DADF] text-[#1C1D1A] font-display font-extrabold text-xs py-2.5 px-4 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
                      >
                        <Eye className="h-4 w-4 text-[#DD700B]" />
                        <span>View Inspection Proof (Before vs. After)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Before vs. After Photo Comparison */}
        {comparisonBooking && comparisonBooking.checkInReport && comparisonBooking.checkOutReport && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-lg text-[#1C1D1A] flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#DD700B]" />
                  <span>Audited Condition Proof: {comparisonBooking.spaceName}</span>
                </h2>
                <p className="text-xs text-[#7C7D75] font-semibold">
                  Side-by-side photographic record verified by the College Authority. Prevents arbitrary damage claims.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-display font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#FCF8D8] text-[#1C1D1A] border border-[#1C1D1A]">
                  Zero Damage Certified
                </span>
                <span className="text-[10px] font-display font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#DD700B] text-white border border-[#1C1D1A]">
                  Deposit 100% Refunded
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-3xl border-2 border-[#1C1D1A] shadow-[4px_4px_0px_0px_#1C1D1A]">
              {/* Check-In Photo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-display font-extrabold uppercase tracking-wider text-[#1C1D1A] bg-[#FCF8D8] px-2.5 py-0.5 rounded-full border border-[#1C1D1A]">
                    Phase 1: Pre-Event Baseline (Check-In)
                  </span>
                  <span className="text-[11px] text-[#7C7D75] font-mono">
                    {format(new Date(comparisonBooking.checkInReport.timestamp), 'dd MMM, hh:mm a')}
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden border-2 border-[#1C1D1A] h-64 bg-[#1C1D1A] relative shadow-inner">
                  <img
                    src={comparisonBooking.checkInReport.photoUrl}
                    alt="Pre-Event Baseline"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#1C1D1A]/80 backdrop-blur-xs text-[#FCF8D8] font-bold text-[10px] px-2.5 py-1 rounded-xl border border-white/20">
                    Verified Clean State Baseline
                  </div>
                </div>
                <p className="text-xs text-[#1C1D1A] italic bg-[#FCF8D8] p-3 rounded-2xl border border-[#1C1D1A]">
                  &ldquo;{comparisonBooking.checkInReport.notes}&rdquo;
                </p>
              </div>

              {/* Check-Out Photo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-display font-extrabold uppercase tracking-wider text-white bg-[#DD700B] px-2.5 py-0.5 rounded-full border border-[#1C1D1A]">
                    Phase 2: Post-Event Handover (Check-Out)
                  </span>
                  <span className="text-[11px] text-[#7C7D75] font-mono">
                    {format(new Date(comparisonBooking.checkOutReport.timestamp), 'dd MMM, hh:mm a')}
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden border-2 border-[#1C1D1A] h-64 bg-[#1C1D1A] relative shadow-inner">
                  <img
                    src={comparisonBooking.checkOutReport.photoUrl}
                    alt="Post-Event Handover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#DD700B] text-white font-bold text-[10px] px-2.5 py-1 rounded-xl border border-white/20">
                    Clean Handover Verified
                  </div>
                </div>
                <p className="text-xs text-[#1C1D1A] italic bg-[#FCF8D8] p-3 rounded-2xl border border-[#1C1D1A]">
                  &ldquo;{comparisonBooking.checkOutReport.notes}&rdquo;
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t-2 border-[#1C1D1A] bg-[#FCF8D8] py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#7C7D75]">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm text-[#1C1D1A]">idlespaces.</span>
            <span>• Fair Access & Visual Photo Proof System</span>
          </div>
          <div className="flex items-center gap-4 text-[#1C1D1A]">
            <span>Audit Ledger Sealed</span>
          </div>
        </div>
      </footer>

      {/* Modal for Check-In / Check-Out Photo Upload */}
      <ConditionReportModal
        isOpen={modalConfig.isOpen}
        bookingId={modalConfig.bookingId}
        spaceName={modalConfig.spaceName}
        phase={modalConfig.phase}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={handleConditionSuccess}
      />
    </div>
  );
}
