'use client';

import * as React from 'react';
import type { Space, SpaceType } from '@/types/database';
import {
  Users,
  Monitor,
  Trophy,
  Building,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
  Plus,
} from 'lucide-react';

interface SpaceCardProps {
  space: Space;
  onRequestAccess?: (space: Space) => void;
  onRentOut?: (space: Space) => void;
  location?: string;
  amenities?: string[];
  isRequested?: boolean;
  isDean?: boolean;
  imageUrl?: string;
  isRentedOut?: boolean;
}

export function SpaceCard({
  space,
  onRequestAccess,
  onRentOut,
  location,
  amenities,
  isRequested = false,
  isDean = false,
  imageUrl,
  isRentedOut = false,
}: SpaceCardProps) {
  const getTypeConfig = (type: SpaceType) => {
    switch (type) {
      case 'auditorium':
        return {
          label: 'Auditorium',
          badgeBg: 'bg-[#7C7D75] text-[#FCF8D8]',
          icon: Building,
          defaultAmenities: ['Dual 4K Projectors', 'Surround PA', 'VIP Stage', 'Central AC'],
          defaultLocation: 'Main Administrative Quad, Floor 1',
        };
      case 'computer_lab':
        return {
          label: 'Computer Lab',
          badgeBg: 'bg-[#DD700B] text-white',
          icon: Monitor,
          defaultAmenities: ['1 Gbps Fiber LAN', 'UPS Redundancy', 'AI Workstations', 'Smart Board'],
          defaultLocation: 'Science & IT Block, Floor 2',
        };
      case 'ground':
        return {
          label: 'Sports Ground',
          badgeBg: 'bg-[#ADACA7] text-[#1C1D1A]',
          icon: Trophy,
          defaultAmenities: ['Floodlights (LED)', 'Natural Grass Turf', 'Covered Pavilion', 'Changing Rooms'],
          defaultLocation: 'East Campus Sports Complex',
        };
      default:
        return {
          label: 'Facility',
          badgeBg: 'bg-[#D9DADF] text-[#1C1D1A]',
          icon: Building,
          defaultAmenities: ['Standard Seating', 'Ventilation', 'Restroom Access'],
          defaultLocation: 'College Campus',
        };
    }
  };

  const config = getTypeConfig(space.type);
  const IconComponent = config.icon;
  const activeAmenities = amenities && amenities.length > 0 ? amenities : config.defaultAmenities;
  const activeLocation = location || config.defaultLocation;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden bg-white border-2 border-[#1C1D1A] rounded-3xl shadow-[4px_4px_0px_0px_#1C1D1A] hover:shadow-[6px_6px_0px_0px_#DD700B] transition-all hover:-translate-y-1">
      {/* Header Info */}
      {imageUrl && <img src={imageUrl} alt={`${space.name} facility`} className="h-44 w-full object-cover border-b-2 border-[#1C1D1A]" />}
      <div className="p-5 pb-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center p-2 rounded-xl border-2 border-[#1C1D1A] ${config.badgeBg}`}>
              <IconComponent className="h-4 w-4" />
            </span>
            <span className={`text-[10px] font-display font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-[#1C1D1A] ${config.badgeBg}`}>
              {config.label}
            </span>
          </div>

          {isDean && isRentedOut ? (
            <div className="flex items-center gap-1.5 rounded-full bg-[#D9DADF] px-2.5 py-1 text-[10px] font-extrabold text-[#1C1D1A] border border-[#1C1D1A]"><CheckCircle2 className="h-3 w-3 text-[#DD700B]" /><span>Facility Listed</span></div>
          ) : isDean ? (
            <div className="flex items-center gap-1.5 rounded-full bg-[#FCF8D8] px-2.5 py-1 text-[10px] font-extrabold text-[#1C1D1A] border border-[#1C1D1A]">
              <span className="h-2 w-2 rounded-full bg-[#DD700B]" />
              <span>Available to Rent Out</span>
            </div>
          ) : isRequested ? (
            <div className="flex items-center gap-1.5 rounded-full bg-[#D9DADF] px-2.5 py-1 text-[10px] font-extrabold text-[#1C1D1A] border border-[#1C1D1A]">
              <CheckCircle2 className="h-3 w-3 text-[#DD700B]" />
              <span>Request Given</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-[#FCF8D8] px-2.5 py-1 text-[10px] font-extrabold text-[#1C1D1A] border border-[#1C1D1A]">
              <span className="h-2 w-2 rounded-full bg-[#DD700B] animate-pulse" />
              <span>Available</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-display font-extrabold text-lg text-[#1C1D1A] group-hover:text-[#DD700B] transition-colors leading-snug">
            {space.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-[#7C7D75] font-semibold mt-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#DD700B]" />
            <span className="truncate">{activeLocation}</span>
          </div>
        </div>

        {/* Capacity & Verification Bento Card */}
        <div className="flex items-center justify-between rounded-2xl bg-[#FCF8D8] p-3 border-2 border-[#1C1D1A]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D9DADF] border border-[#1C1D1A] text-[#1C1D1A]">
              <Users className="h-4 w-4 text-[#DD700B]" />
            </div>
            <div>
              <p className="text-[9px] font-extrabold uppercase text-[#7C7D75]">Max Capacity</p>
              <p className="text-xs font-display font-extrabold text-[#1C1D1A]">
                {space.capacity.toLocaleString()} Seats
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-extrabold uppercase text-[#7C7D75]">Asset Ledger</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1C1D1A]">
              <ShieldCheck className="h-3 w-3 text-[#DD700B]" />
              Verified
            </span>
          </div>
        </div>

        {/* Key Amenities */}
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-display font-extrabold uppercase tracking-wider text-[#7C7D75]">
            Key Amenities
          </p>
          <div className="flex flex-wrap gap-1.5">
            {activeAmenities.map((amenity, idx) => (
              <span
                key={idx}
                className="rounded-xl bg-[#D9DADF] px-2.5 py-0.5 text-[10px] font-bold text-[#1C1D1A] border border-[#1C1D1A]"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-4 pt-3 border-t-2 border-[#1C1D1A] bg-[#FCF8D8]/70 flex items-center justify-between gap-3">
        <div className="text-xs">
          {isDean ? (
            <>
              <span className="text-[10px] uppercase font-extrabold text-[#7C7D75] block">Provider Quota</span>
              <span className="text-[#1C1D1A] font-bold text-xs">Public Asset</span>
            </>
          ) : (
            <>
              <span className="text-[10px] uppercase font-extrabold text-[#DD700B] block">Tier 1 NGO / Societal</span>
              <span className="text-[#7C7D75] font-semibold text-[10px]">₹0 Tariff for NGOs & Societal</span>
            </>
          )}
        </div>

        {isDean && isRentedOut ? (
          <span className="text-xs font-display font-extrabold text-[#7C7D75]">Currently Listed</span>
        ) : isDean ? (
          /* Dean: Service Provider Mode (Cannot request access, can rent out) */
          <button
            type="button"
            onClick={() => onRentOut?.(space)}
            className="bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] font-display font-extrabold text-xs py-2 px-3.5 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#DD700B] flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer"
            title="Rent out or post new availability slots for this facility"
          >
            <Plus className="h-3.5 w-3.5 text-[#DD700B]" />
            <span>Rent Out Facility</span>
          </button>
        ) : isRequested ? (
          /* Normal User / NGO: Already requested */
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="bg-[#D9DADF] text-[#1C1D1A] font-display font-extrabold text-xs py-2 px-3.5 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] flex items-center gap-1.5 cursor-not-allowed opacity-90 select-none"
            title="Access request already registered for this facility"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-[#DD700B]" />
            <span>Request Given</span>
          </button>
        ) : (
          /* Normal User / NGO: Request access */
          <button
            type="button"
            onClick={() => onRequestAccess?.(space)}
            className="bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs py-2 px-3.5 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] flex items-center gap-1.5 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Request Access</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
