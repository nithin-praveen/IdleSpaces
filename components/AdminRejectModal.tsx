'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  ArrowRight,
  XCircle,
  FileText,
} from 'lucide-react';

interface AdminRejectModalProps {
  bookingId: string | null;
  applicantName: string;
  spaceName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (bookingId: string, reason: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function AdminRejectModal({
  bookingId,
  applicantName,
  spaceName,
  isOpen,
  onClose,
  onConfirmReject,
  isSubmitting = false,
}: AdminRejectModalProps) {
  const [reason, setReason] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setReason('');
      setError(null);
    }
  }, [isOpen]);

  if (!bookingId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason || reason.trim().length < 10) {
      setError('Statutory reason is strictly mandatory (minimum 10 characters required).');
      return;
    }

    try {
      setError(null);
      await onConfirmReject(bookingId, reason.trim());
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to record rejection.';
      setError(msg);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg border-red-200 p-0 overflow-hidden shadow-2xl">
        {/* Anti-Corruption Red Top Alert Bar */}
        <div className="bg-red-900 px-6 py-3.5 text-white flex items-center justify-between border-b border-red-950">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-full bg-red-700 flex items-center justify-center text-white shadow-xs">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-red-200">
                Anti-Corruption Regulatory Check
              </p>
              <p className="text-[11px] text-red-300">
                Section 21 • Mandatory Rejection Justification
              </p>
            </div>
          </div>
          <Badge variant="outline" className="border-red-400 text-red-100 text-[10px]">
            <Lock className="h-3 w-3 mr-1" />
            Immutable
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-lg font-bold text-slate-900">
              Reject Requisition for {spaceName}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Applicant: <strong className="text-slate-800">{applicantName}</strong> (Booking ID: #{bookingId.substring(0, 8)})
            </DialogDescription>
          </DialogHeader>

          {/* Friction Warning Banner */}
          <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-red-800">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
              <span>Arbitrary Denials Are Prohibited by Law</span>
            </div>
            <p className="text-red-700 leading-relaxed text-[11px]">
              To prevent unlawful collusion, discrimination, or reserving public facilities for private entities, you must document a verifiable, objective reason (e.g. conflicting government examinations, scheduled structural repairs, or invalid certifications).
            </p>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-100 border border-red-300 text-red-800 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Mandatory Reason Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="rejectReason" className="text-slate-900 font-semibold text-xs">
                Statutory Justification (Mandatory)*
              </Label>
              <span className="text-[11px] text-slate-400">
                {reason.length} / 10 min chars
              </span>
            </div>
            <textarea
              id="rejectReason"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Facility booked for State Higher Secondary Board examinations during this date range; certified schedule document published by District Magistrate."
              className="w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              required
            />
            <p className="text-[10px] text-slate-400">
              This statement will be published in the permanent public audit ledger alongside your Administrator ID.
            </p>
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              disabled={isSubmitting || reason.trim().length < 10}
              className={`gap-1.5 ${reason.trim().length < 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span>Writing to Immutable Audit Log...</span>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <span>Submit Justified Rejection</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
