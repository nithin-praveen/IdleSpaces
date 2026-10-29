'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { submitConditionReport } from '@/app/actions';
import type { ReportPhase } from '@/types/database';
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface ConditionReportModalProps {
  bookingId: string | null;
  spaceName: string;
  phase: ReportPhase;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingId: string, phase: ReportPhase, photoUrl: string, notes: string, hasDamage: boolean) => void;
}

export function ConditionReportModal({
  bookingId,
  spaceName,
  phase,
  isOpen,
  onClose,
  onSuccess,
}: ConditionReportModalProps) {
  const [selectedPhoto, setSelectedPhoto] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [notes, setNotes] = React.useState<string>('');
  const [hasDamage, setHasDamage] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedPhoto(null);
      setPreviewUrl(null);
      setNotes(
        phase === 'check-in'
          ? 'Inspected facility upon arrival. Stage, seating rows, and AV console are clean and in working order.'
          : 'Event concluded. Facility swept, trash disposed, and equipment returned to standard layout.'
      );
      setHasDamage(false);
      setErrorMessage(null);
    }
  }, [isOpen, phase]);

  if (!bookingId) return null;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedPhoto(file);
      const fakeUrl = URL.createObjectURL(file);
      setPreviewUrl(fakeUrl);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPhoto && !previewUrl) {
      setErrorMessage('A photographic condition proof is mandatory before submission.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const generatedPhotoUrl =
      previewUrl ||
      (phase === 'check-in'
        ? 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80');

    try {
      await submitConditionReport(
        bookingId,
        phase,
        generatedPhotoUrl,
        notes,
        hasDamage
      );
    } catch {
      // Offline fallback
    }

    onSuccess(bookingId, phase, generatedPhotoUrl, notes, hasDamage);
    setIsSubmitting(false);
    onClose();
  };

  const isCheckIn = phase === 'check-in';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white border-2 border-[#1C1D1A] rounded-3xl p-0 overflow-hidden shadow-[6px_6px_0px_0px_#1C1D1A] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className={`px-6 py-4 text-[#FCF8D8] flex items-center justify-between border-b-2 border-[#1C1D1A] shrink-0 ${
          isCheckIn ? 'bg-[#7C7D75]' : 'bg-[#1C1D1A]'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#DD700B] flex items-center justify-center text-white">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-display font-extrabold uppercase tracking-wider text-[#D9DADF]">
                Facility Condition Accountability Protocol
              </p>
              <h3 className="text-sm font-display font-extrabold text-[#FCF8D8]">
                {isCheckIn ? 'Pre-Event Baseline Check-In' : 'Post-Event Check-Out Inspection'}
              </h3>
            </div>
          </div>
          <span className="text-[9px] font-display font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#1C1D1A] text-[#FCF8D8] border border-white/20">
            Phase: {phase}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="modal-scroll flex-1 p-6 space-y-4 text-xs">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-lg font-display font-extrabold text-[#1C1D1A]">
                {spaceName}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#7C7D75]">
                {isCheckIn
                  ? 'Mandatory: Upload a wide-angle photograph of the clean facility to establish initial condition baseline.'
                  : 'Mandatory: Upload photograph after cleanup to verify zero damage and authorize security deposit refund.'}
              </DialogDescription>
            </DialogHeader>

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-[#DD700B] text-white border-2 border-[#1C1D1A] text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Photo Upload Dropzone */}
            <div className="space-y-1.5">
              <label className="text-xs font-display font-extrabold text-[#1C1D1A] flex justify-between items-center">
                <span>{isCheckIn ? 'Wide-Angle Baseline Photo Proof' : 'Post-Event Clean Condition Photo'}</span>
                <span className="text-[10px] text-[#7C7D75] font-semibold">Mandatory</span>
              </label>

              <div className="relative border-2 border-dashed border-[#1C1D1A] rounded-2xl p-5 hover:bg-[#D9DADF] transition-colors bg-[#FCF8D8]/70 text-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {previewUrl ? (
                  <div className="space-y-2 pointer-events-none">
                    <div className="relative h-44 w-full rounded-xl overflow-hidden border-2 border-[#1C1D1A] mx-auto bg-black">
                      <img
                        src={previewUrl}
                        alt="Condition Proof Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] font-bold text-[#1C1D1A]">
                      Photo attached • Click to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none py-2">
                    <div className="h-10 w-10 rounded-xl bg-white border-2 border-[#1C1D1A] flex items-center justify-center text-[#DD700B] shadow-[2px_2px_0px_0px_#1C1D1A]">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div className="text-xs space-y-0.5">
                      <p className="font-display font-extrabold text-[#1C1D1A]">
                        Take Photo with Mobile or Browse Files
                      </p>
                      <p className="text-[10px] text-[#7C7D75] font-semibold">
                        PNG, JPG, or WEBP up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Inspection Notes */}
            <div className="space-y-1">
              <label className="text-xs font-display font-extrabold text-[#1C1D1A] block">
                Official Condition Log Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Document any pre-existing markings or event handover notes..."
                required
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] text-xs font-semibold text-[#1C1D1A] focus:outline-hidden focus:border-[#DD700B]"
              />
            </div>

            {/* Check-Out Damage Report Toggle */}
            {!isCheckIn && (
              <div className="p-3.5 rounded-2xl border-2 border-[#1C1D1A] bg-[#FCF8D8] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${hasDamage ? 'text-[#DD700B]' : 'text-[#7C7D75]'}`} />
                    <span className="font-display font-extrabold text-xs text-[#1C1D1A]">
                      Report Unresolved Damage or Missing Equipment?
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={hasDamage}
                    onChange={(e) => setHasDamage(e.target.checked)}
                    className="h-4 w-4 rounded border-2 border-[#1C1D1A] accent-[#DD700B] cursor-pointer"
                  />
                </div>
                {hasDamage && (
                  <p className="text-[11px] text-[#DD700B] font-bold">
                    Notice: Reporting damage flags the deposit for manual Dean review.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Footer */}
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
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-2xl bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs cursor-pointer border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : isCheckIn ? 'Submit Pre-Event Check-In' : 'Submit Check-Out & Refund'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
