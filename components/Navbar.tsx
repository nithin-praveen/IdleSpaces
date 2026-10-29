'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/AuthProvider';
import {
  Landmark,
  ShieldCheck,
  Building,
  CalendarCheck2,
  Lock,
  LogOut,
  LogIn,
  User,
  ShieldAlert,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, switchDemoRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  const navLinks = [
    {
      name: 'Discover Spaces',
      href: '/discover',
      icon: Building,
      badge: 'Step 1: Request',
      requiresAdmin: false,
    },
    {
      name: 'My Bookings & Check-In',
      href: '/bookings',
      icon: CalendarCheck2,
      badge: 'Step 3: Proof',
      requiresAdmin: false,
    },
    {
      name: 'Admin Audit Review',
      href: '/admin',
      icon: ShieldCheck,
      badge: 'Step 2: Ledger',
      requiresAdmin: true,
    },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xs shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Logo & Government Crest */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="h-10 w-10 rounded-xl bg-blue-900 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-900/10 group-hover:bg-blue-800 transition-colors">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                  IdleSpaces
                </span>
                <span className="text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 uppercase tracking-wider">
                  Gov Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Fair Asset Allocation & Anti-Corruption Ledger
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));
              const isLockedForUser = link.requiresAdmin && user?.role !== 'admin';

              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="hidden md:inline">{link.name}</span>
                    <span className="md:hidden">{link.name.split(' ')[0]}</span>
                    {isLockedForUser && (
                      <Lock className="h-3 w-3 text-amber-500 shrink-0" />
                    )}
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

          {/* User Profile / Authentication State */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Active User Pill with Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-left transition-colors"
                  >
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
                        user.role === 'admin'
                          ? 'bg-blue-900'
                          : user.role === 'ngo'
                          ? 'bg-emerald-600'
                          : 'bg-purple-600'
                      }`}
                    >
                      {user.role === 'admin' ? 'AD' : user.role === 'ngo' ? 'NGO' : 'CP'}
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 leading-tight">
                          {user.name.split(' ')[0]}
                        </span>
                        <Badge
                          variant={
                            user.role === 'admin'
                              ? 'gov'
                              : user.role === 'ngo'
                              ? 'success'
                              : 'outline'
                          }
                          className="text-[9px] px-1 py-0 uppercase"
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {user.organization}
                      </p>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu for Quick Role Switching */}
                  {roleMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1"
                      onMouseLeave={() => setRoleMenuOpen(false)}
                    >
                      <div className="px-2.5 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800">{user.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[10px] text-emerald-700 font-medium">Session Active (TLS Encrypted)</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <p className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Switch Role (Demo Mode)
                        </p>
                        <button
                          type="button"
                          onClick={async () => {
                            await switchDemoRole('admin');
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                            user.role === 'admin'
                              ? 'bg-blue-50 text-blue-900 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>Institutional Admin (Dean)</span>
                          {user.role === 'admin' && <span className="text-[10px] text-blue-600">Active</span>}
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            await switchDemoRole('ngo');
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                            user.role === 'ngo'
                              ? 'bg-emerald-50 text-emerald-900 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>Tier 1 NGO Officer</span>
                          {user.role === 'ngo' && <span className="text-[10px] text-emerald-600">Active</span>}
                        </button>

                        <button
                          type="button"
                          onClick={async () => {
                            await switchDemoRole('corporate');
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between ${
                            user.role === 'corporate'
                              ? 'bg-purple-50 text-purple-900 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>Tier 2 Corporate CSR</span>
                          {user.role === 'corporate' && <span className="text-[10px] text-purple-600">Active</span>}
                        </button>
                      </div>

                      <div className="border-t border-slate-100 pt-1 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setRoleMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-1.5"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Secure Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Logout Icon Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => logout()}
                  title="Sign Out"
                  className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="gov" size="sm" className="gap-1.5 text-xs font-semibold h-9 px-3.5 shadow-xs">
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
