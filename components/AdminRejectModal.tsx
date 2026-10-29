'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
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
      <DialogContent className="sm:max-w-lg bg-white border-2 border-[#1C1D1A] rounded-3xl p-0 overflow-hidden shadow-[6px_6px_0px_0px_#1C1D1A] max-h-[90vh] flex flex-col">
        {/* Anti-Corruption Alert Bar */}
        <div className="bg-[#1C1D1A] px-6 py-4 text-[#FCF8D8] flex items-center justify-between border-b-2 border-[#1C1D1A] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#DD700B] flex items-center justify-center text-white">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-display font-extrabold uppercase tracking-wider text-[#DD700B]">
                Anti-Corruption Regulatory Check
              </p>
              <h2 className="text-xs font-display font-extrabold text-[#FCF8D8]">
                Section 21 • Mandatory Justification
              </h2>
            </div>
          </div>
          <span className="text-[9px] font-display font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#7C7D75] text-white border border-white/20 flex items-center gap-1">
            <Lock className="h-2.5 w-2.5 text-[#DD700B]" />
            Immutable
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="modal-scroll flex-1 p-6 space-y-4 text-xs">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-lg font-display font-extrabold text-[#1C1D1A]">
                Reject Requisition for {spaceName}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#7C7D75]">
                Applicant: <strong>{applicantName}</strong> (Token: #{bookingId.substring(0, 8)})
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div className="p-3.5 rounded-2xl bg-[#DD700B] text-white border-2 border-[#1C1D1A] text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-[#DD700B] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#1C1D1A] font-semibold leading-relaxed">
                <strong>Statutory Mandate:</strong> Arbitrary rejections without valid legal or schedule conflict justifications violate Section 14 of the Public Asset Transparency Act.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-display font-extrabold text-[#1C1D1A] block">
                Official Gazette Reason for Rejection
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Specify regulatory conflict, prior statutory reservation, or maintenance closure schedule..."
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] text-xs font-semibold text-[#1C1D1A] focus:outline-hidden focus:border-[#DD700B]"
              />
            </div>
          </div>

          <div className="p-4 px-6 border-t-2 border-[#1C1D1A] bg-[#FCF8D8] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#D9DADF] text-[#1C1D1A] font-display font-extrabold text-xs cursor-pointer border-2 border-[#1C1D1A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="px-5 py-2.5 rounded-2xl bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs cursor-pointer border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isSubmitting ? 'Recording Rejection...' : 'Confirm Justified Rejection'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
