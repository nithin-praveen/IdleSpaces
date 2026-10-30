'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getCurrentUserAction } from '@/app/auth-actions';
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
    cancelled: 'CANCELLED',
  };
  return map[status] || 'STATUS_UPDATE';
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
      return { success: false, error: 'Failed to retrieve available facilities.' };
    }

    return { success: true, data: data ?? [] };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error fetching spaces.';
    console.error('[getSpaces] Unexpected error:', message);
    return { success: false, error: 'An unexpected system error occurred.' };
  }
}

// ==============================================================================
// 2. createBookingRequest()
//    Inserts a booking with status = 'pending' AND simultaneously writes an
//    audit_log entry with action = 'REQUESTED'. Both must succeed.
//    SECURITY: Enforces session-derived identity to prevent IDOR attacks.
// ==============================================================================

export async function createBookingRequest(
  spaceId: string,
  userId: string,
  startDate: string,        // YYYY-MM-DD
  endDate: string,          // YYYY-MM-DD
  docUrl: string | null = null
): Promise<ActionResult<{ booking: Booking; auditLog: AuditLog }>> {
  // Session authentication check (Defense against IDOR)
  const sessionUser = await getCurrentUserAction();
  if (!sessionUser) {
    return {
      success: false,
      error: 'Statutory 401: You must be authenticated to submit a statutory asset requisition.',
    };
  }

  // Bind strictly to the verified cryptographic session identity
  const effectiveUserId = sessionUser.id;

  // --- Input validation ---
  if (!spaceId || !startDate || !endDate) {
    return {
      success: false,
      error: 'spaceId, startDate, and endDate are all required.',
    };
  }

  if (new Date(endDate) < new Date(startDate)) {
    return { success: false, error: 'End date must be on or after start date.' };
  }

  try {
    const supabase = await getSupabase();

    // ── Step 1: Insert booking ──────────────────────────────────────────────
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: effectiveUserId,
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
        error: 'Statutory booking requisition failed to submit. Please check parameters.',
      };
    }

    // ── Step 2: Write audit log immediately after booking ───────────────────
    const { data: auditLog, error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        booking_id: booking.id,
        action: 'REQUESTED',
        reason: null,
        performed_by: effectiveUserId,
      })
      .select()
      .single();

    if (auditError || !auditLog) {
      console.error(
        '[createBookingRequest] CRITICAL: booking created but audit log failed.',
        'booking_id:', booking.id,
        'error:', auditError?.message
      );
      return {
        success: false,
        error: `Booking created (id: ${booking.id}) but audit log could not be written. Please contact administration.`,
      };
    }

    return { success: true, data: { booking, auditLog } };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error creating booking.';
    console.error('[createBookingRequest] Unexpected error:', message);
    return { success: false, error: 'Requisition could not be finalized.' };
  }
}

// ==============================================================================
// 3. updateBookingStatus()
//    Updates booking status AND appends an immutable audit_log row recording
//    the admin's ID, the action, and the reason.
//    SECURITY: Enforces session-derived admin role check to prevent IDOR.
// ==============================================================================

export async function updateBookingStatus(
  bookingId: string,
  adminId: string,
  newStatus: BookingStatus,
  reason: string | null = null
): Promise<ActionResult<{ booking: Booking; auditLog: AuditLog }>> {
  // Session authorization check (Defense against IDOR & privilege escalation)
  const sessionUser = await getCurrentUserAction();
  if (!sessionUser || sessionUser.role !== 'admin') {
    return {
      success: false,
      error: 'Statutory 403 Forbidden: Only verified Institutional Administrators can review or update booking allocations.',
    };
  }

  const effectiveAdminId = sessionUser.id;

  // --- Input validation ---
  if (!bookingId || !newStatus) {
    return {
      success: false,
      error: 'bookingId and newStatus are required.',
    };
  }

  const requiresReason: BookingStatus[] = ['rejected', 'approved'];
  if (requiresReason.includes(newStatus) && (!reason || reason.trim().length === 0)) {
    return {
      success: false,
      error: `A non-empty statutory justification is mandatory when setting status to '${newStatus}'. ` +
        'This ensures anti-corruption transparency and institutional accountability.',
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
        error: 'Booking allocation record could not be updated.',
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
        performed_by: effectiveAdminId,
      })
      .select()
      .single();

    if (auditError || !auditLog) {
      console.error(
        '[updateBookingStatus] CRITICAL: status updated but audit log failed.',
        'booking_id:', bookingId,
        'new_status:', newStatus,
        'admin_id:', effectiveAdminId,
        'error:', auditError?.message
      );
      return {
        success: false,
        error:
          `Booking status updated to '${newStatus}' (id: ${bookingId}) ` +
          `but the audit log could not be written. Please investigate immediately.`,
      };
    }

    return { success: true, data: { booking, auditLog } };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown error updating booking status.';
    console.error('[updateBookingStatus] Unexpected error:', message);
    return { success: false, error: 'Allocation decision failed to commit.' };
  }
}

// ==============================================================================
// 4. submitConditionReport()
//    Inserts a condition_report row for a given booking phase.
//    SECURITY: Enforces session-derived ownership check before accepting reports.
// ==============================================================================

export async function submitConditionReport(
  bookingId: string,
  phase: ReportPhase,
  photoUrl: string,
  notes: string | null = null,
  hasDamage: boolean = false
): Promise<ActionResult<ConditionReport>> {
  // Session authentication check
  const sessionUser = await getCurrentUserAction();
  if (!sessionUser) {
    return {
      success: false,
      error: 'Authentication required to submit photographic asset condition inspection.',
    };
  }

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

  if (!photoUrl.startsWith('http://') && !photoUrl.startsWith('https://')) {
    return {
      success: false,
      error: 'photoUrl must be a secure URL (must start with https:// or http://).',
    };
  }

  try {
    const supabase = await getSupabase();

    // Verify ownership if non-admin
    if (sessionUser.role !== 'admin') {
      const { data: bookingCheck, error: checkError } = await supabase
        .from('bookings')
        .select('user_id')
        .eq('id', bookingId)
        .single();

      if (checkError || !bookingCheck || bookingCheck.user_id !== sessionUser.id) {
        return {
          success: false,
          error: 'Statutory 403 Forbidden: You may only submit condition reports for bookings belonging to your organization.',
        };
      }
    }

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
      return { success: false, error: 'Condition report submission failed.' };
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
    return { success: false, error: 'Failed to record condition report.' };
  }
}
