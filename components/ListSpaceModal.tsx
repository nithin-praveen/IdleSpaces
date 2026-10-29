'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface ListSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpaceListed?: (newSpace: {
    id: string;
    name: string;
    type: 'auditorium' | 'computer_lab' | 'ground';
    capacity: number;
    location: string;
  }) => void;
}

export function ListSpaceModal({
  isOpen,
  onClose,
  onSpaceListed,
}: ListSpaceModalProps) {
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<'auditorium' | 'computer_lab' | 'ground'>('auditorium');
  const [capacity, setCapacity] = React.useState(350);
  const [location, setLocation] = React.useState('Academic Quad, Block B');
  const [amenities, setAmenities] = React.useState('Dual 4K Projectors, Central AC, Surround PA, Green Room');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setName('');
      setType('auditorium');
      setCapacity(350);
      setLocation('Academic Quad, Block B');
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onSpaceListed?.({
        id: `space-${Date.now()}`,
        name: name.trim(),
        type,
        capacity: Number(capacity) || 100,
        location,
      });
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-white rounded-3xl border-2 border-[#1C1D1A] p-0 overflow-hidden shadow-[6px_6px_0px_0px_#1C1D1A] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1C1D1A] text-[#FCF8D8] px-6 py-4 flex items-center justify-between border-b-2 border-[#1C1D1A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#DD700B] text-white flex items-center justify-center font-bold">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-display font-extrabold text-[#FCF8D8] tracking-tight">
                List Institutional Asset
              </h2>
              <p className="text-xs text-[#ADACA7]">
                Register idle labs, halls, or testing facilities for verified sharing
              </p>
            </div>
          </div>
          <span className="text-[10px] font-display font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#7C7D75] text-[#FCF8D8] border border-white/20">
            Resource Ledger
          </span>
        </div>

        {isSuccess ? (
          <div className="modal-scroll flex-1 p-6 sm:p-8 text-center space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-[#FCF8D8] text-[#DD700B] flex items-center justify-center mx-auto border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-display font-extrabold text-[#1C1D1A]">
                Facility Listed Successfully
              </h3>
              <p className="text-xs text-[#7C7D75] mt-1 max-w-sm mx-auto font-semibold leading-relaxed">
                <strong>{name}</strong> is now registered in the institutional asset network with 70% community quota protection.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-[#DD700B] hover:bg-[#c96205] text-white text-xs font-display font-extrabold py-3 rounded-2xl border-2 border-[#1C1D1A] shadow-[3px_3px_0px_0px_#1C1D1A] cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="modal-scroll flex-1 p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-display font-extrabold text-[#1C1D1A] block">
                  Facility / Equipment Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bio-Genomics Testing Suite 4A"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] text-xs font-semibold text-[#1C1D1A] focus:outline-hidden focus:border-[#DD700B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-display font-extrabold text-[#1C1D1A] block">
                    Category Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-2xl bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] text-xs text-[#1C1D1A] font-bold focus:outline-hidden focus:border-[#DD700B]"
                  >
                    <option value="auditorium">Auditorium / Hall</option>
                    <option value="computer_lab">Computing & AI Lab</option>
                    <option value="ground">Sports Complex</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-display font-extrabold text-[#1C1D1A] block">
                    Capacity / Workstations
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={10000}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] text-xs text-[#1C1D1A] font-bold focus:outline-hidden focus:border-[#DD700B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-display font-extrabold text-[#1C1D1A] block">
                  Campus Location / Building Block
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Academic Quad, Block B"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] text-xs font-semibold text-[#1C1D1A] focus:outline-hidden focus:border-[#DD700B]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-display font-extrabold text-[#1C1D1A] block">
                  Key Amenities & Safety Standard
                </label>
                <input
                  type="text"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  placeholder="e.g. Dual 4K Projectors, Central AC, Surround PA, Green Room"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] text-xs font-semibold text-[#1C1D1A] focus:outline-hidden focus:border-[#DD700B]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-[#DD700B] shrink-0" />
                <p className="text-[11px] text-[#1C1D1A] font-semibold leading-relaxed">
                  70% available slots are prioritized for verified public & educational research organizations.
                </p>
              </div>
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
                disabled={isSubmitting || !name.trim()}
                className="px-5 py-2.5 rounded-2xl bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs cursor-pointer border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isSubmitting ? 'Registering...' : 'Publish Listing'}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
