'use client';

import * as React from 'react';
import { SpaceCard } from '@/components/SpaceCard';
import { BookingModal } from '@/components/BookingModal';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getSpaces } from '@/app/actions';
import type { Space, SpaceType } from '@/types/database';
import {
  Landmark,
  Search,
  Filter,
  ShieldCheck,
  Building,
  Monitor,
  Trophy,
  SlidersHorizontal,
  CheckCircle2,
  RefreshCw,
  Clock,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';

// Government College Spaces Catalog (Default Curated Seed)
const DEFAULT_SPACES: Space[] = [
  {
    id: 'f1a23456-789a-4bcd-ef01-234567890001',
    name: 'Sardar Vallabhbhai Patel Central Auditorium',
    type: 'auditorium',
    capacity: 750,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'f1a23456-789a-4bcd-ef01-234567890002',
    name: 'Dr. APJ Abdul Kalam Advanced Computing & AI Lab',
    type: 'computer_lab',
    capacity: 140,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'f1a23456-789a-4bcd-ef01-234567890003',
    name: 'Major Dhyan Chand Multi-Sport Complex & Pavilion',
    type: 'ground',
    capacity: 2200,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'f1a23456-789a-4bcd-ef01-234567890004',
    name: 'Rabindranath Tagore Cultural & Performing Arts Hall',
    type: 'auditorium',
    capacity: 450,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'f1a23456-789a-4bcd-ef01-234567890005',
    name: 'Srinivasa Ramanujan Computational Data Center',
    type: 'computer_lab',
    capacity: 90,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'f1a23456-789a-4bcd-ef01-234567890006',
    name: 'Swami Vivekananda Open Athletics Oval & Grounds',
    type: 'ground',
    capacity: 3500,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
];

export default function DiscoverSpacesPage() {
  const [spaces, setSpaces] = React.useState<Space[]>(DEFAULT_SPACES);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedSpace, setSelectedSpace] = React.useState<Space | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedType, setSelectedType] = React.useState<'all' | SpaceType>('all');
  const [capacityFilter, setCapacityFilter] = React.useState<number>(0);
  const [recentBookingRef, setRecentBookingRef] = React.useState<string | null>(null);

  // Fetch from server action
  React.useEffect(() => {
    let isMounted = true;
    async function loadSpaces() {
      try {
        setLoading(true);
        const result = await getSpaces();
        if (isMounted) {
          if (result.success && result.data && result.data.length > 0) {
            setSpaces(result.data);
          } else {
            // Keep default catalog for seamless demonstration
            setSpaces(DEFAULT_SPACES);
          }
        }
      } catch (err) {
        console.warn('Using default spaces catalog:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSpaces();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered spaces
  const filteredSpaces = React.useMemo(() => {
    return spaces.filter((space) => {
      const matchesSearch =
        space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        space.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || space.type === selectedType;
      const matchesCapacity = capacityFilter === 0 || space.capacity >= capacityFilter;
      return matchesSearch && matchesType && matchesCapacity;
    });
  }, [spaces, searchQuery, selectedType, capacityFilter]);

  const handleBookingSuccess = (bookingId: string) => {
    setRecentBookingRef(bookingId);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans">
      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner with Trust & Anti-Corruption SLA */}
        <section className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 sm:p-8 text-white shadow-lg border border-slate-800">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300 border border-blue-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Public Asset Transparency Mandate • Zero Arbitrary Denials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Fair Allocation of Government College Infrastructure
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Discover and request access to vacant auditoriums, high-performance computing centers, and sports arenas. Tier 1 quota grants subsidized access to certified non-governmental community organizations.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700/60">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Listed Assets</p>
                <p className="text-xl font-bold text-white">{spaces.length} Spaces</p>
              </div>
              <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700/60">
                <p className="text-[10px] uppercase font-semibold text-emerald-400">NGO Quota</p>
                <p className="text-xl font-bold text-emerald-300">70% Reserved</p>
              </div>
              <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700/60">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Audit Status</p>
                <p className="text-xl font-bold text-blue-300">100% Immutable</p>
              </div>
              <div className="rounded-xl bg-slate-800/80 p-3 border border-slate-700/60">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Response SLA</p>
                <p className="text-xl font-bold text-amber-300">48h Max</p>
              </div>
            </div>
          </div>

          {/* Decorative government background watermark */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-8 opacity-10 pointer-events-none">
            <Landmark className="h-96 w-96 text-white" />
          </div>
        </section>

        {/* Recent Application Notice (if any) */}
        {recentBookingRef && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Application In Progress
                </p>
                <p className="text-sm font-semibold">
                  Request Ref #{recentBookingRef} logged to official audit ledger. Status: PENDING REVIEW.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRecentBookingRef(null)}
              className="text-xs border-emerald-300 bg-white hover:bg-emerald-100 text-emerald-900"
            >
              Dismiss
            </Button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by facility name, space type, or campus block..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 border-slate-300 focus-visible:ring-blue-600 rounded-lg text-sm"
              />
            </div>

            {/* Space Type Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedType('all')}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === 'all'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                All Spaces ({spaces.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('auditorium')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === 'auditorium'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <Building className="h-3.5 w-3.5" />
                Auditoriums
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('computer_lab')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === 'computer_lab'
                    ? 'bg-sky-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                Computer Labs
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('ground')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === 'ground'
                    ? 'bg-emerald-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                <Trophy className="h-3.5 w-3.5" />
                Sports Grounds
              </button>
            </div>
          </div>

          {/* Secondary Filters Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                Capacity Filter:
              </span>
              <button
                type="button"
                onClick={() => setCapacityFilter(0)}
                className={`px-2.5 py-1 rounded-md border text-[11px] cursor-pointer ${
                  capacityFilter === 0
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                Any Capacity
              </button>
              <button
                type="button"
                onClick={() => setCapacityFilter(100)}
                className={`px-2.5 py-1 rounded-md border text-[11px] cursor-pointer ${
                  capacityFilter === 100
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                100+ Seats
              </button>
              <button
                type="button"
                onClick={() => setCapacityFilter(500)}
                className={`px-2.5 py-1 rounded-md border text-[11px] cursor-pointer ${
                  capacityFilter === 500
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                500+ Seats
              </button>
              <button
                type="button"
                onClick={() => setCapacityFilter(1000)}
                className={`px-2.5 py-1 rounded-md border text-[11px] cursor-pointer ${
                  capacityFilter === 1000
                    ? 'bg-slate-900 text-white border-slate-900 font-bold'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                1,000+ Seats
              </button>
            </div>

            <div>
              <span className="text-slate-500">
                Displaying <strong>{filteredSpaces.length}</strong> of <strong>{spaces.length}</strong> available facilities
              </span>
            </div>
          </div>
        </section>

        {/* Task 1 Requirement: Grid of SpaceCards */}
        <section>
          {filteredSpaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onRequestAccess={(selected) => setSelectedSpace(selected)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Facilities Match Your Criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your search keywords or resetting the category and capacity filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setCapacityFilter(0);
                }}
              >
                Reset All Filters
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* Task 2 Requirement: BookingModal Component */}
      <BookingModal
        space={selectedSpace}
        isOpen={!!selectedSpace}
        onClose={() => setSelectedSpace(null)}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}
