'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Space, SpaceType } from '@/types/database';
import {
  Users,
  Monitor,
  Trophy,
  Building,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  ShieldCheck,
  ArrowUpRight,
  Wifi,
  Volume2,
} from 'lucide-react';

interface SpaceCardProps {
  space: Space;
  onRequestAccess: (space: Space) => void;
  location?: string;
  amenities?: string[];
}

export function SpaceCard({
  space,
  onRequestAccess,
  location,
  amenities,
}: SpaceCardProps) {
  // Helper for type styling
  const getTypeConfig = (type: SpaceType) => {
    switch (type) {
      case 'auditorium':
        return {
          label: 'Auditorium',
          badgeVariant: 'purple' as const,
          icon: Building,
          colorClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300',
          gradientClass: 'from-purple-600/10 via-transparent to-transparent',
          defaultAmenities: ['Dual 4K Projectors', 'Dolby Surround PA', 'VIP Stage', 'Central AC'],
          defaultLocation: 'Main Administrative Quad, Floor 1',
        };
      case 'computer_lab':
        return {
          label: 'Computer Lab',
          badgeVariant: 'gov' as const,
          icon: Monitor,
          colorClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300',
          gradientClass: 'from-sky-600/10 via-transparent to-transparent',
          defaultAmenities: ['1 Gbps Fiber LAN', 'UPS Redundancy', 'Linux/Win Workstations', 'Smart Board'],
          defaultLocation: 'Science & IT Block, Floor 2',
        };
      case 'ground':
        return {
          label: 'Sports Ground',
          badgeVariant: 'success' as const,
          icon: Trophy,
          colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
          gradientClass: 'from-emerald-600/10 via-transparent to-transparent',
          defaultAmenities: ['Floodlights (LED)', 'Natural Grass Turf', 'Covered Pavilion', 'Changing Rooms'],
          defaultLocation: 'East Campus Sports Complex',
        };
      default:
        return {
          label: 'College Space',
          badgeVariant: 'secondary' as const,
          icon: Building,
          colorClass: 'bg-slate-50 text-slate-700 border-slate-200',
          gradientClass: 'from-slate-600/10 via-transparent to-transparent',
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
    <Card className="group relative flex flex-col justify-between overflow-hidden border-slate-200 bg-white transition-all duration-300 hover:border-blue-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 rounded-2xl">
      {/* Top subtle government asset status strip */}
      <div className={`h-1.5 w-full bg-linear-to-r ${config.gradientClass} bg-slate-200 group-hover:bg-blue-600 transition-colors`} />

      <div>
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center justify-center p-2 rounded-xl border ${config.colorClass}`}>
                <IconComponent className="h-5 w-5" />
              </span>
              <div>
                <Badge variant={config.badgeVariant} className="text-[11px] font-semibold tracking-wide uppercase">
                  {config.label}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available</span>
            </div>
          </div>

          <CardTitle className="mt-3.5 text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-900 dark:text-slate-100 transition-colors">
            {space.name}
          </CardTitle>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{activeLocation}</span>
          </div>
        </CardHeader>

        <CardContent className="px-5 py-2 space-y-4">
          {/* Capacity Stat */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-xs border border-slate-200/80 text-blue-900 dark:bg-slate-900 dark:border-slate-700">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase text-slate-400">Max Capacity</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {space.capacity.toLocaleString()} Persons
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium uppercase text-slate-400">Asset Verification</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                Gov Registered
              </span>
            </div>
          </div>

          {/* Amenities Pills */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Key Infrastructure
            </p>
            <div className="flex flex-wrap gap-1.5">
              {activeAmenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/50"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="p-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2 bg-slate-50/40 dark:bg-slate-900/40">
        <div className="w-full flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Tier 1 Quota</span>
            <span className="text-slate-500 font-medium text-[11px]">Free for Verified NGOs</span>
          </div>

          {/* Task 1 Requirement: "Request Access" button */}
          <Button
            type="button"
            variant="gov"
            size="sm"
            onClick={() => onRequestAccess(space)}
            className="group/btn gap-1.5 shadow-sm hover:shadow transition-all font-semibold"
          >
            <span>Request Access</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
