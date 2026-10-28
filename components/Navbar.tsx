'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Landmark,
  ShieldCheck,
  Building,
  CalendarCheck2,
  FileSpreadsheet,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    {
      name: 'Discover Spaces',
      href: '/discover',
      icon: Building,
      badge: 'Step 1: Request',
    },
    {
      name: 'My Bookings & Check-In',
      href: '/bookings',
      icon: CalendarCheck2,
      badge: 'Step 3: Proof',
    },
    {
      name: 'Admin Audit Review',
      href: '/admin',
      icon: ShieldCheck,
      badge: 'Step 2: Ledger',
    },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/95 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Government Crest */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-blue-900 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-900/10 group-hover:bg-blue-800 transition-colors">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  IdleSpaces
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 uppercase tracking-wider">
                  Gov Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Fair College Asset Allocation & Anti-Corruption Ledger
              </p>
            </div>
          </Link>

          {/* Navigation Links for Judge Flow */}
          <div className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="hidden md:inline">{link.name}</span>
                    <span className="md:hidden">{link.name.split(' ')[0]}</span>
                    {isActive && (
                      <span className="hidden lg:inline text-[9px] bg-blue-800/80 px-1.5 py-0.5 rounded text-blue-200">
                        {link.badge.split(':')[0]}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Judge / Demo Environment Indicator */}
          <div className="flex items-center gap-2">
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hackathon Live Demo</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
