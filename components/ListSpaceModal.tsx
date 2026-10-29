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
  Building2,
  CheckCircle2,
  ShieldCheck,
  Plus,
  MapPin,
  Users,
  X,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

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
  const { user } = useAuth();
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<'auditorium' | 'computer_lab' | 'ground'>('auditorium');
  const [capacity, setCapacity] = React.useState(350);
  const [location, setLocation] = React.useState('Science & Arts Quad, Block B');
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
      <DialogContent className="sm:max-w-lg bg-[#FCF8D8] rounded-3xl border-2 border-[#1C1D1A] p-0 overflow-hidden shadow-[5px_5px_0px_0px_#1C1D1A]">
        {/* Header */}
        <div className="bg-[#1C1D1A] text-[#FCF8D8] px-6 py-5 flex items-center justify-between border-b-2 border-[#1C1D1A]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#DD700B] text-white flex items-center justify-center font-bold">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-extrabold text-white tracking-tight">
                List Institutional Asset
              </h2>
              <p className="text-xs text-[#ADACA7]">
                Register idle labs, halls, or testing facilities for verified sharing
              </p>
            </div>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[#7C7D75] text-white">
            Resource Ledger
          </span>
        </div>

        {isSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-[#DD700B] text-white flex items-center justify-center mx-auto border-2 border-[#1C1D1A]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-display font-extrabold text-[#1C1D1A]">
                Facility Listed Successfully
              </h3>
              <p className="text-xs text-[#7C7D75] mt-1 max-w-sm mx-auto font-medium">
                <strong>{name}</strong> is now registered in the institutional asset network with 70% community quota protection.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] text-xs font-display font-extrabold py-3 rounded-2xl border-2 border-[#1C1D1A] cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium">
            <div className="space-y-1">
              <label className="font-extrabold text-[#1C1D1A] block">
                Facility / Equipment Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bio-Genomics Testing Suite 4A"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border-2 border-[#1C1D1A] text-[#1C1D1A] focus:outline-none focus:ring-2 focus:ring-[#DD700B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-extrabold text-[#1C1D1A] block">
                  Category Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-2xl bg-white border-2 border-[#1C1D1A] text-[#1C1D1A] font-bold"
                >
                  <option value="auditorium">Auditorium / Hall</option>
                  <option value="computer_lab">Computing & AI Lab</option>
                  <option value="ground">Sports Complex</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#1C1D1A] block">
                  Capacity / Workstations
                </label>
                <input
                  type="number"
                  min={10}
                  max={10000}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border-2 border-[#1C1D1A] text-[#1C1D1A] font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-[#1C1D1A] block">
                Campus Location / Building Block
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Science Quad, Ground Floor"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border-2 border-[#1C1D1A] text-[#1C1D1A]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-extrabold text-[#1C1D1A] block">
                Key Amenities & Safety Standard
              </label>
              <input
                type="text"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
                placeholder="e.g. Cleanroom Class 1000, 1Gbps LAN, Dual Spectrometers"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border-2 border-[#1C1D1A] text-[#1C1D1A]"
              />
            </div>

            <div className="p-3 rounded-2xl bg-[#D9DADF] border-2 border-[#1C1D1A] flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#DD700B] shrink-0" />
              <p className="text-[11px] text-[#1C1D1A] leading-tight">
                70% available slots are prioritized for verified public & educational research organizations.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl bg-[#D9DADF] hover:bg-[#ADACA7] text-[#1C1D1A] font-extrabold cursor-pointer border border-[#1C1D1A]/20 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="px-5 py-2.5 rounded-2xl bg-[#DD700B] hover:bg-[#c46206] text-white font-display font-extrabold cursor-pointer border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] transition-colors disabled:opacity-50"
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

