'use client';

import * as React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ConditionReportModal } from '@/components/ConditionReportModal';
import type { ReportPhase } from '@/types/database';
import {
  CalendarCheck2,
  Camera,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Lock,
  Layers,
  Sparkles,
  MapPin,
  FileCheck2,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/components/AuthProvider';
import { LogIn } from 'lucide-react';

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

  // Condition modal state
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

  // Selected comparison view
  const [comparisonBooking, setComparisonBooking] = React.useState<UserBooking | null>(
    INITIAL_USER_BOOKINGS[1]
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

    // Auto-update comparison if currently viewed
    const updated = bookings.find((b) => b.id === bookingId);
    if (updated) {
      setComparisonBooking(updated);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* NGO Header Banner */}
        <section className="rounded-2xl bg-slate-900 p-6 sm:p-8 text-white border border-slate-800 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/30">
                <Camera className="h-4 w-4" />
                <span>Accountability Flow • Pre & Post Event Visual Proof</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                My Space Reservations & Inspection Ledger
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Check-in before your event and submit post-event clean photos. Transparent photo evidence protects your organization and expedites immediate security deposit release.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
              <div className="h-10 w-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white text-sm">
                PE
              </div>
              <div>
                <p className="text-xs font-bold text-white">Pratham Youth Initiative</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Tier 1 Verified NGO • 70% Quota Beneficiary</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Reservations Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck2 className="h-5 w-5 text-blue-900" />
              <span>Active Requisitions & Accountability Stages</span>
            </h2>
            <Link href="/discover">
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <span>Request Another Facility</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((booking) => {
              const hasCheckIn = !!booking.checkInReport;
              const hasCheckOut = !!booking.checkOutReport;

              return (
                <Card
                  key={booking.id}
                  className="rounded-2xl border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="gov" className="text-[10px] font-mono">
                            Ref: #{booking.id.substring(0, 8)}
                          </Badge>
                          <Badge variant="outline" className="capitalize text-[10px]">
                            {booking.spaceType.replace('_', ' ')}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-bold text-slate-900 mt-2">
                          {booking.spaceName}
                        </CardTitle>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{booking.location}</span>
                        </p>
                      </div>

                      <div>
                        {booking.status === 'approved' && (
                          <Badge variant="success" className="text-xs px-2.5 py-1">
                            Approved
                          </Badge>
                        )}
                        {booking.status === 'completed' && (
                          <Badge variant="secondary" className="text-xs px-2.5 py-1">
                            Completed & Sealed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-5 py-3 space-y-4 text-xs">
                    {/* Event Schedule Info */}
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Event Dates</span>
                        <p className="font-bold text-slate-800 text-xs mt-0.5">
                          {booking.startDate} — {booking.endDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Security Deposit</span>
                        <p className="font-bold text-emerald-800 text-xs mt-0.5">
                          ₹{booking.securityDeposit.toLocaleString()} ({booking.depositStatus.toUpperCase()})
                        </p>
                      </div>
                    </div>

                    {/* Step 3 3-Stage Progress Timeline */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Event Accountability Flow
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                        {/* Stage 1: Allocation */}
                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                          <CheckCircle2 className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
                          <span>Sanctioned</span>
                        </div>

                        {/* Stage 2: Pre-Check-in */}
                        <div
                          className={`p-2 rounded-lg border font-semibold ${
                            hasCheckIn
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse'
                          }`}
                        >
                          {hasCheckIn ? (
                            <CheckCircle2 className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
                          ) : (
                            <Camera className="h-4 w-4 mx-auto text-amber-600 mb-1" />
                          )}
                          <span>{hasCheckIn ? 'Checked-In' : 'Check-In Due'}</span>
                        </div>

                        {/* Stage 3: Post-Check-out */}
                        <div
                          className={`p-2 rounded-lg border font-semibold ${
                            hasCheckOut
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                              : hasCheckIn
                              ? 'bg-blue-50 border-blue-200 text-blue-900'
                              : 'bg-slate-100 border-slate-200 text-slate-400'
                          }`}
                        >
                          {hasCheckOut ? (
                            <CheckCircle2 className="h-4 w-4 mx-auto text-emerald-600 mb-1" />
                          ) : (
                            <Lock className="h-4 w-4 mx-auto text-slate-400 mb-1" />
                          )}
                          <span>{hasCheckOut ? 'Checked-Out' : 'Check-Out'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
                    {/* Check In Action */}
                    {!hasCheckIn && (
                      <Button
                        type="button"
                        variant="gov"
                        size="sm"
                        onClick={() => handleOpenConditionModal(booking, 'check-in')}
                        className="w-full gap-2 font-semibold shadow-xs"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Perform Pre-Event Check-In (Photo Proof)</span>
                      </Button>
                    )}

                    {/* Check Out Action */}
                    {hasCheckIn && !hasCheckOut && (
                      <Button
                        type="button"
                        variant="gov"
                        size="sm"
                        onClick={() => handleOpenConditionModal(booking, 'check-out')}
                        className="w-full gap-2 bg-purple-900 hover:bg-purple-800 text-white font-semibold shadow-xs"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Perform Post-Event Check-Out & Refund Deposit</span>
                      </Button>
                    )}

                    {/* Both Complete */}
                    {hasCheckIn && hasCheckOut && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setComparisonBooking(booking)}
                        className="w-full gap-2 text-xs font-semibold border-emerald-300 bg-emerald-50 text-emerald-950 hover:bg-emerald-100"
                      >
                        <Eye className="h-4 w-4 text-emerald-700" />
                        <span>View Inspection Proof (Before vs. After)</span>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Standout UI Feature: Before vs. After Photo Comparison */}
        {comparisonBooking && comparisonBooking.checkInReport && comparisonBooking.checkOutReport && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span>Audited Condition Proof: {comparisonBooking.spaceName}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Side-by-side photographic record verified by the College Caretaker. Prevents arbitrary damage claims.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-xs">
                  Zero Damage Certified
                </Badge>
                <Badge variant="outline" className="text-xs text-emerald-800 bg-emerald-50">
                  Deposit 100% Refunded
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              {/* BEFORE PHOTO (Check-In) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Phase 1: Pre-Event Baseline (Check-In)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {format(new Date(comparisonBooking.checkInReport.timestamp), 'dd MMM, hh:mm a')}
                  </span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 h-64 bg-slate-900 relative shadow-inner">
                  <img
                    src={comparisonBooking.checkInReport.photoUrl}
                    alt="Pre-Event Baseline"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded">
                    Verified Clean State Baseline
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  &ldquo;{comparisonBooking.checkInReport.notes}&rdquo;
                </p>
              </div>

              {/* AFTER PHOTO (Check-Out) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Phase 2: Post-Event Handover (Check-Out)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {format(new Date(comparisonBooking.checkOutReport.timestamp), 'dd MMM, hh:mm a')}
                  </span>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 h-64 bg-slate-900 relative shadow-inner">
                  <img
                    src={comparisonBooking.checkOutReport.photoUrl}
                    alt="Post-Event Handover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-emerald-900/90 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded">
                    Clean Handover Verified
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  &ldquo;{comparisonBooking.checkOutReport.notes}&rdquo;
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

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
