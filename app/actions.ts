'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';
import type {
  Space,
  Booking,
  AuditLog,
  ConditionReport,
  BookingStatus,
  ReportPhase,
} from '@/types/database';

// ==============================================================================
// INTERNAL: Typed Server Client Factory
// Creates a fresh, typed Supabase client for each Server Action invocation.
// Never shared across requests.
// ==============================================================================

async function getSupabase() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — middleware handles refresh.
          }
        },
      },
    }
  );
}

// ==============================================================================
// STANDARDIZED RESPONSE TYPE
// Every action returns this shape so the UI can handle success/error uniformly.
// ==============================================================================

type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

// ==============================================================================
// HELPER: Map BookingStatus → AuditAction string
// ==============================================================================

function statusToAuditAction(status: BookingStatus): string {
  const map: Record<BookingStatus, string> = {
    pending: 'REQUESTED',
    approved: 'APPROVED',
    rejected: 'REJECTED',
    waitlisted: 'WAITLISTED',
    completed: 'COMPLETED',
  };
  return map[status];
}

// ==============================================================================
// 1. getSpaces()
//    Fetches all available college spaces ordered alphabetically.
//    RLS ensures only `is_active = true` rows are returned to non-admins.
// ==============================================================================

export async function getSpaces(): Promise<ActionResult<Space[]>> {
  try {
    const supabase = await getSupabase();

    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('[getSpaces] Supabase error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ?? [] };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error fetching spaces.';
    console.error('[getSpaces] Unexpected error:', message);
    return { success: false, error: message };
  }
}

// ==============================================================================
// 2. createBookingRequest()
//    Inserts a booking with status = 'pending' AND simultaneously writes an
//    audit_log entry with action = 'REQUESTED'. Both must succeed — a partial
//    failure is surfaced clearly so admins can investigate.
// ==============================================================================

export async function createBookingRequest(
  spaceId: string,
  userId: string,
  startDate: string,        // YYYY-MM-DD
  endDate: string,          // YYYY-MM-DD
  docUrl: string | null = null
): Promise<ActionResult<{ booking: Booking; auditLog: AuditLog }>> {
  // --- Input validation ---
  if (!spaceId || !userId || !startDate || !endDate) {
    return {
      success: false,
      error: 'spaceId, userId, startDate, and endDate are all required.',
    };
  }

  if (new Date(endDate) < new Date(startDate)) {
    return { success: false, error: 'end_date must be on or after start_date.' };
  }

  try {
    const supabase = await getSupabase();

    // ── Step 1: Insert booking ──────────────────────────────────────────────
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        space_id: spaceId,
        start_date: startDate,
        end_date: endDate,
        status: 'pending' as BookingStatus,
        eligibility_doc_url: docUrl,
      })
      .select()
      .single();

    if (bookingError || !booking) {
      console.error('[createBookingRequest] Booking insert error:', bookingError?.message);
      return {
        success: false,
        error: bookingError?.message ?? 'Failed to create booking.',
      };
    }

    // ── Step 2: Write audit log immediately after booking ───────────────────
    // Records the REQUESTED action with the booking ID so the full trail
    // is available from the moment the request lands.
    const { data: auditLog, error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        booking_id: booking.id,
        action: 'REQUESTED',
        reason: null,
        performed_by: userId,
      })
      .select()
      .single();

    if (auditError || !auditLog) {
      // Booking created but audit trail is broken — log critical warning.
      console.error(
        '[createBookingRequest] CRITICAL: booking created but audit log failed.',
        'booking_id:', booking.id,
        'error:', auditError?.message
      );
      return {
        success: false,
        error: `Booking created (id: ${booking.id}) but audit log could not be written: ${auditError?.message}. Please contact support.`,
      };
    }

    return { success: true, data: { booking, auditLog } };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error creating booking.';
    console.error('[createBookingRequest] Unexpected error:', message);
    return { success: false, error: message };
  }
}

// ==============================================================================
// 3. updateBookingStatus()
//    Updates booking status AND appends an immutable audit_log row recording
//    the admin's ID, the action, and the reason.
//
//    Anti-corruption rule: 'rejected' and 'approved' require a non-empty reason.
//    This mirrors the DB-level constraint chk_rejection_reason_mandatory but
//    surfaces a user-friendly message instead of a raw Postgres error.
// ==============================================================================

export async function updateBookingStatus(
  bookingId: string,
  adminId: string,
  newStatus: BookingStatus,
  reason: string | null = null
): Promise<ActionResult<{ booking: Booking; auditLog: AuditLog }>> {
  // --- Input validation ---
  if (!bookingId || !adminId || !newStatus) {
    return {
      success: false,
      error: 'bookingId, adminId, and newStatus are all required.',
    };
  }

  const requiresReason: BookingStatus[] = ['rejected', 'approved'];
  if (requiresReason.includes(newStatus) && (!reason || reason.trim().length === 0)) {
    return {
      success: false,
      error: `A non-empty reason is mandatory when setting status to '${newStatus}'. ` +
        'This is required to maintain transparency and prevent arbitrary decisions.',
    };
  }

  try {
    const supabase = await getSupabase();

    // ── Step 1: Update booking status ───────────────────────────────────────
    const { data: booking, error: updateError } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)
      .select()
      .single();

    if (updateError || !booking) {
      console.error('[updateBookingStatus] Update error:', updateError?.message);
      return {
        success: false,
        error: updateError?.message ?? 'Booking not found or update failed.',
      };
    }

    // ── Step 2: Append immutable audit log ──────────────────────────────────
    const auditAction = statusToAuditAction(newStatus);

    const { data: auditLog, error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        booking_id: bookingId,
        action: auditAction,
        reason: reason?.trim() ?? null,
        performed_by: adminId,
      })
      .select()
      .single();

    if (auditError || !auditLog) {
      // Status updated but audit trail is broken — extremely critical.
      console.error(
        '[updateBookingStatus] CRITICAL: status updated but audit log failed.',
        'booking_id:', bookingId,
        'new_status:', newStatus,
        'admin_id:', adminId,
        'error:', auditError?.message
      );
      return {
        success: false,
        error:
          `Booking status updated to '${newStatus}' (id: ${bookingId}) ` +
          `but the audit log could not be written: ${auditError?.message}. ` +
          'Please investigate immediately.',
      };
    }

    return { success: true, data: { booking, auditLog } };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown error updating booking status.';
    console.error('[updateBookingStatus] Unexpected error:', message);
    return { success: false, error: message };
  }
}

// ==============================================================================
// 4. submitConditionReport()
//    Inserts a condition_report row for a given booking phase.
//    The DB enforces UNIQUE (booking_id, phase) — duplicate submissions return
//    a readable error message instead of a raw Postgres constraint violation.
// ==============================================================================

export async function submitConditionReport(
  bookingId: string,
  phase: ReportPhase,
  photoUrl: string,
  notes: string | null = null,
  hasDamage: boolean = false
): Promise<ActionResult<ConditionReport>> {
  // --- Input validation ---
  if (!bookingId || !phase || !photoUrl) {
    return {
      success: false,
      error: 'bookingId, phase, and photoUrl are all required.',
    };
  }

  if (phase !== 'check-in' && phase !== 'check-out') {
    return {
      success: false,
      error: "phase must be either 'check-in' or 'check-out'.",
    };
  }

  if (!photoUrl.startsWith('http')) {
    return {
      success: false,
      error: 'photoUrl must be a valid URL (must start with http or https).',
    };
  }

  try {
    const supabase = await getSupabase();

    const { data, error } = await supabase
      .from('condition_reports')
      .insert({
        booking_id: bookingId,
        phase,
        photo_url: photoUrl,
        notes: notes?.trim() ?? null,
        damage_reported: hasDamage,
      })
      .select()
      .single();

    if (error) {
      // Detect unique constraint violation for duplicate phase submission
      const isDuplicate =
        error.code === '23505' ||
        error.message.toLowerCase().includes('uq_booking_phase') ||
        error.message.toLowerCase().includes('unique');

      if (isDuplicate) {
        return {
          success: false,
          error:
            `A '${phase}' condition report already exists for this booking. ` +
            'Each booking can only have one report per phase.',
        };
      }

      console.error('[submitConditionReport] Supabase error:', error.message);
      return { success: false, error: error.message };
    }

    if (!data) {
      return {
        success: false,
        error: 'Condition report was not returned after insert.',
      };
    }

    return { success: true, data };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown error submitting condition report.';
    console.error('[submitConditionReport] Unexpected error:', message);
    return { success: false, error: message };
  }
}
