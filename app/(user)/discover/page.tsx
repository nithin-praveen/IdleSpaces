'use client';

import * as React from 'react';
import { SpaceCard } from '@/components/SpaceCard';
import { BookingModal } from '@/components/BookingModal';
import { ListSpaceModal } from '@/components/ListSpaceModal';
import { Navbar } from '@/components/Navbar';
import { getSpaces } from '@/app/actions';
import type { Space, SpaceType } from '@/types/database';
import {
  Search,
  ShieldCheck,
  Building,
  Monitor,
  Trophy,
  CheckCircle2,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { getRequestedSpaceRecords, isSpaceRequested } from '@/lib/requested-spaces';
import { useAuth } from '@/components/AuthProvider';

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
    name: 'Dr. APJ Abdul Kalam Advanced AI & Computing Lab',
    type: 'computer_lab',
    capacity: 140,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'f1a23456-789a-4bcd-ef01-234567890003',
    name: 'Major Dhyan Chand Multi-Sport Complex',
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
  const { user } = useAuth();
  const isDean = user?.role === 'admin';

  const [spaces, setSpaces] = React.useState<Space[]>(DEFAULT_SPACES);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedSpace, setSelectedSpace] = React.useState<Space | null>(null);
  const [isListModalOpen, setIsListModalOpen] = React.useState<boolean>(false);

  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedType, setSelectedType] = React.useState<'all' | SpaceType>('all');
  const [capacityFilter, setCapacityFilter] = React.useState<number>(0);
  const [recentBookingRef, setRecentBookingRef] = React.useState<string | null>(null);
  const [requestedSpaceIds, setRequestedSpaceIds] = React.useState<string[]>([]);

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
            setSpaces(DEFAULT_SPACES);
          }
        }
      } catch {
        // Fallback default catalog
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSpaces();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync requested spaces from localStorage and custom events
  React.useEffect(() => {
    const refreshRequested = () => {
      const records = getRequestedSpaceRecords();
      setRequestedSpaceIds(records.map((r) => r.spaceId));
    };

    refreshRequested();
    window.addEventListener('idlespaces_requested_changed', refreshRequested);
    window.addEventListener('storage', refreshRequested);

    return () => {
      window.removeEventListener('idlespaces_requested_changed', refreshRequested);
      window.removeEventListener('storage', refreshRequested);
    };
  }, []);

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

  const handleBookingSuccess = (bookingId: string, spaceId?: string) => {
    setRecentBookingRef(bookingId);
    if (spaceId) {
      setRequestedSpaceIds((prev) => (prev.includes(spaceId) ? prev : [...prev, spaceId]));
    }
  };

  const handleRequestClick = (space: Space) => {
    // If user is a Dean, they cannot request access
    if (isDean) return;

    // If already requested, disallow opening the modal
    if (requestedSpaceIds.includes(space.id) || isSpaceRequested(space)) {
      return;
    }
    setSelectedSpace(space);
  };

  const handleSpaceListed = (newSpace: {
    id: string;
    name: string;
    type: 'auditorium' | 'computer_lab' | 'ground';
    capacity: number;
    location: string;
  }) => {
    setSpaces((prev) => [
      {
        id: newSpace.id,
        name: newSpace.name,
        type: newSpace.type,
        capacity: newSpace.capacity,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-[#FCF8D8] text-[#1C1D1A] font-body selection:bg-[#DD700B] selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* ── CONDITIONAL BANNER: DEAN PROVIDER MODE VS PUBLIC APPLICANT MODE ── */}
        {isDean ? (
          <section className="bg-[#1C1D1A] text-[#FCF8D8] rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#DD700B] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#7C7D75] px-3.5 py-1 text-xs font-bold text-[#FCF8D8] border border-white/20">
                <ShieldCheck className="h-3.5 w-3.5 text-[#DD700B]" />
                <span>Dean Administrative Custodian Mode • Service Provider</span>
              </div>
              <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#FCF8D8] tracking-tight leading-tight">
                Rent Out College Halls & Infrastructure
              </h1>
              <p className="text-xs sm:text-sm text-[#D9DADF] font-medium leading-relaxed">
                As Dean, you provide the service. Register vacant auditoriums, computing labs, and stadiums to rent them out to grassroots NGOs and research bodies. Review incoming bookings under Dean Review.
              </p>
            </div>


            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsListModalOpen(true)}
                className="bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs sm:text-sm py-3 px-6 rounded-2xl border-2 border-white shadow-[3px_3px_0px_0px_white] flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" />
                <span>Rent Out New Hall / Facility</span>
              </button>
            </div>
          </section>
        ) : (
          <section className="bg-white rounded-3xl border-2 border-[#1C1D1A] shadow-[5px_5px_0px_0px_#1C1D1A] p-6 sm:p-8 space-y-4">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#D9DADF] px-3.5 py-1.5 text-xs font-bold text-[#1C1D1A] border-2 border-[#1C1D1A]">
                <span className="h-2 w-2 rounded-full bg-[#DD700B] animate-pulse" />
                <span>Public Asset Transparency Mandate • Zero Arbitrary Denials</span>
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1C1D1A] tracking-tight leading-tight">
                Fair Allocation of Government College Infrastructure
              </h1>
              <p className="text-sm sm:text-base text-[#1C1D1A]/85 font-medium leading-relaxed max-w-2xl">
                Discover and request access to vacant auditoriums, high-performance computing centers, and sports arenas. Tier 1 quota grants subsidized access to certified non-governmental & societal community organizations.
              </p>

              {/* Quick Metrics Bento */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="rounded-2xl bg-[#FCF8D8] p-3.5 border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
                  <p className="text-[10px] uppercase font-extrabold text-[#7C7D75]">Listed Assets</p>
                  <p className="font-display text-xl font-extrabold text-[#1C1D1A]">{spaces.length} Spaces</p>
                </div>
                <div className="rounded-2xl bg-[#DD700B] text-white p-3.5 border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
                  <p className="text-[10px] uppercase font-extrabold text-white/80">NGO Quota</p>
                  <p className="font-display text-xl font-extrabold text-white">70% Reserved</p>
                </div>
                <div className="rounded-2xl bg-[#7C7D75] text-[#FCF8D8] p-3.5 border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
                  <p className="text-[10px] uppercase font-extrabold text-[#D9DADF]">Audit Status</p>
                  <p className="font-display text-xl font-extrabold text-[#FCF8D8]">100% Sealed</p>
                </div>
                <div className="rounded-2xl bg-[#D9DADF] text-[#1C1D1A] p-3.5 border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
                  <p className="text-[10px] uppercase font-extrabold text-[#7C7D75]">Response SLA</p>
                  <p className="font-display text-xl font-extrabold text-[#1C1D1A]">48h Max</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Application Notification Banner (Only for Requesters) */}
        {!isDean && recentBookingRef && (
          <div className="rounded-2xl border-2 border-[#1C1D1A] bg-[#FCF8D8] p-4 text-[#1C1D1A] flex items-center justify-between shadow-[3px_3px_0px_0px_#1C1D1A]">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-[#DD700B] text-white flex items-center justify-center font-bold border border-[#1C1D1A]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-display font-extrabold uppercase tracking-wider text-[#DD700B]">
                  Application In Progress
                </p>
                <p className="text-xs sm:text-sm font-bold text-[#1C1D1A]">
                  Request Ref #{recentBookingRef} logged to official audit ledger. Status: PENDING REVIEW.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRecentBookingRef(null)}
              className="text-xs font-bold px-3 py-1 rounded-xl bg-white border border-[#1C1D1A] hover:bg-[#D9DADF] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter & Search Bar */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border-2 border-[#1C1D1A] shadow-[3px_3px_0px_0px_#1C1D1A]">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7C7D75]" />
              <input
                type="text"
                placeholder="Search by facility name, space type, or campus block..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-11 bg-[#FCF8D8]/50 border-2 border-[#1C1D1A] rounded-2xl text-xs sm:text-sm font-semibold text-[#1C1D1A] placeholder:text-[#7C7D75] focus:outline-hidden focus:border-[#DD700B]"
              />
            </div>

            {/* Space Type Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedType('all')}
                className={`px-3.5 py-2 rounded-2xl text-xs font-display font-extrabold transition-all border-2 border-[#1C1D1A] cursor-pointer ${
                  selectedType === 'all'
                    ? 'bg-[#DD700B] text-white shadow-[2px_2px_0px_0px_#1C1D1A]'
                    : 'bg-white text-[#1C1D1A] hover:bg-[#D9DADF]'
                }`}
              >
                All Spaces ({spaces.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('auditorium')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-display font-extrabold transition-all border-2 border-[#1C1D1A] cursor-pointer ${
                  selectedType === 'auditorium'
                    ? 'bg-[#7C7D75] text-[#FCF8D8] shadow-[2px_2px_0px_0px_#1C1D1A]'
                    : 'bg-white text-[#1C1D1A] hover:bg-[#D9DADF]'
                }`}
              >
                <Building className="h-3.5 w-3.5" />
                <span>Auditoriums</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('computer_lab')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-display font-extrabold transition-all border-2 border-[#1C1D1A] cursor-pointer ${
                  selectedType === 'computer_lab'
                    ? 'bg-[#D9DADF] text-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]'
                    : 'bg-white text-[#1C1D1A] hover:bg-[#D9DADF]'
                }`}
              >
                <Monitor className="h-3.5 w-3.5 text-[#DD700B]" />
                <span>Computer Labs</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('ground')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-display font-extrabold transition-all border-2 border-[#1C1D1A] cursor-pointer ${
                  selectedType === 'ground'
                    ? 'bg-[#ADACA7] text-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]'
                    : 'bg-white text-[#1C1D1A] hover:bg-[#D9DADF]'
                }`}
              >
                <Trophy className="h-3.5 w-3.5 text-[#DD700B]" />
                <span>Sports Grounds</span>
              </button>
            </div>
          </div>

          {/* Secondary Filters Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs text-[#7C7D75] font-bold gap-3 px-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-[10px] uppercase tracking-wider text-[#1C1D1A]">
                Capacity Filter:
              </span>
              {[
                { label: 'Any Capacity', val: 0 },
                { label: '100+ Seats', val: 100 },
                { label: '500+ Seats', val: 500 },
                { label: '1,000+ Seats', val: 1000 },
              ].map((filter) => (
                <button
                  key={filter.val}
                  type="button"
                  onClick={() => setCapacityFilter(filter.val)}
                  className={`px-3 py-1 rounded-xl border-2 border-[#1C1D1A] text-[11px] font-bold transition-all cursor-pointer ${
                    capacityFilter === filter.val
                      ? 'bg-[#1C1D1A] text-[#FCF8D8] shadow-[2px_2px_0px_0px_#7C7D75]'
                      : 'bg-white text-[#1C1D1A] hover:bg-[#D9DADF]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div>
              <span>
                Displaying <strong className="text-[#1C1D1A]">{filteredSpaces.length}</strong> of{' '}
                <strong className="text-[#1C1D1A]">{spaces.length}</strong> {isDean ? 'managed facilities' : 'available facilities'}
              </span>
            </div>
          </div>
        </section>

        {/* SpaceCards Grid */}
        <section>
          {filteredSpaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpaces.map((space) => {
                const requested =
                  !isDean &&
                  (requestedSpaceIds.includes(space.id) || isSpaceRequested(space));

                return (
                  <SpaceCard
                    key={space.id}
                    space={space}
                    isDean={isDean}
                    isRequested={requested}
                    onRequestAccess={handleRequestClick}
                    onRentOut={() => setIsListModalOpen(true)}
                  />
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-3xl border-2 border-dashed border-[#1C1D1A] bg-white p-12 text-center space-y-4 shadow-[4px_4px_0px_0px_#1C1D1A]">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-[#FCF8D8] border-2 border-[#1C1D1A] flex items-center justify-center text-[#1C1D1A]">
                <Search className="h-6 w-6 text-[#DD700B]" />
              </div>
              <h3 className="font-display font-extrabold text-base text-[#1C1D1A]">No Facilities Match Your Criteria</h3>
              <p className="text-xs text-[#7C7D75] max-w-sm mx-auto font-medium">
                Try loosening your search keywords or resetting the category and capacity filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setCapacityFilter(0);
                }}
                className="bg-[#DD700B] hover:bg-[#c96205] text-white font-display font-extrabold text-xs py-2 px-4 rounded-xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#1C1D1A] bg-[#FCF8D8] py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#7C7D75]">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-sm text-[#1C1D1A]">idlespaces.</span>
            <span>• Fair Access & Institutional Asset Sharing Network</span>
          </div>
          <div className="flex items-center gap-4 text-[#1C1D1A]">
            <span>Security Standard ISO/IEC 27001</span>
            <span>•</span>
            <span>Immutable Audit Trail Active</span>
          </div>
        </div>
      </footer>

      {/* Booking Modal (Only accessible to Requesters/NGOs) */}
      <BookingModal
        space={selectedSpace}
        isOpen={!!selectedSpace}
        onClose={() => setSelectedSpace(null)}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* List Space Modal (Accessible to Deans to rent out facilities) */}
      <ListSpaceModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        onSpaceListed={handleSpaceListed}
      />
    </div>
  );
}
