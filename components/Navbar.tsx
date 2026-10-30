'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/AuthProvider';
import {
  ShieldCheck,
  Building,
  CalendarCheck2,
  Lock,
  LogOut,
  LogIn,
  ChevronDown,
  ArrowUpRight,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, switchDemoRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  const navLinks = [
    {
      name: 'Discover',
      href: '/discover',
      icon: Building,
      activeColor: 'bg-[#DD700B] text-white',
      requiresAdmin: false,
    },
    {
      name: 'How It Works',
      href: '/how-it-works',
      icon: Sparkles,
      activeColor: 'bg-[#1C1D1A] text-[#FCF8D8]',
      requiresAdmin: false,
    },
    {
      name: 'About',
      href: '/about',
      icon: HelpCircle,
      activeColor: 'bg-[#1C1D1A] text-[#FCF8D8]',
      requiresAdmin: false,
    },
    {
      name: 'Dean Review',
      href: '/admin',
      icon: ShieldCheck,
      activeColor: 'bg-[#7C7D75] text-[#FCF8D8]',
      requiresAdmin: true,
    },
    {
      name: 'Check-In Proof',
      href: '/bookings',
      icon: CalendarCheck2,
      activeColor: 'bg-[#ADACA7] text-[#1C1D1A]',
      requiresAdmin: false,
    },
  ];

  // Only show Dean Review to users who are logged in as admin/dean
  const visibleNavLinks = navLinks.filter(
    (link) => !link.requiresAdmin || user?.role === 'admin'
  );

  return (
    <nav className="sticky top-0 z-40 border-b-2 border-[#1C1D1A] bg-[#FCF8D8]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Brand Mark */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1C1D1A] group-hover:text-[#DD700B] transition-colors">
              idlespaces.
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#DD700B] animate-pulse" />
          </Link>

          {/* Navigation Links (Filtered strictly by role) */}
          <div className="hidden md:flex items-center gap-1.5 sm:gap-2">
            {visibleNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link key={link.href} href={link.href}>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-display font-bold border-2 transition-all cursor-pointer ${
                      isActive
                        ? `${link.activeColor} border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]`
                        : 'bg-transparent text-[#1C1D1A] border-transparent hover:border-[#1C1D1A] hover:bg-[#D9DADF]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* User Profile / Authentication State */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Active User Pill with Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-2xl bg-[#D9DADF] hover:bg-[#c7c9cf] border-2 border-[#1C1D1A] text-left transition-colors cursor-pointer"
                  >
                    <div className="h-6 w-6 rounded-full bg-[#1C1D1A] text-[#FCF8D8] flex items-center justify-center font-bold text-[10px]">
                      {user.role === 'admin' ? 'DEAN' : user.role === 'ngo' ? 'NGO' : 'USER'}
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#1C1D1A] leading-tight">
                          {user.name.split(' ')[0]}
                        </span>
                        <span className="text-[9px] font-extrabold uppercase px-1 rounded bg-[#1C1D1A] text-white">
                          {user.role === 'admin' ? 'Dean (Provider)' : user.role === 'ngo' ? 'NGO (Requester)' : user.role}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-[#1C1D1A]" />
                  </button>

                  {/* Dropdown Menu for Quick Role Switching */}
                  {roleMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-[#FCF8D8] rounded-2xl shadow-xl border-2 border-[#1C1D1A] p-2 z-50 animate-in fade-in slide-in-from-top-1"
                      onMouseLeave={() => setRoleMenuOpen(false)}
                    >
                      <div className="px-2.5 py-2 border-b-2 border-[#1C1D1A]/20">
                        <p className="text-xs font-bold text-[#1C1D1A]">{user.name}</p>
                        <p className="text-[10px] text-[#7C7D75] font-mono">{user.email}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#DD700B]" />
                          <span className="text-[10px] text-[#DD700B] font-bold">
                            {user.role === 'admin' ? 'Service Provider (Dean)' : 'Civic Requester (NGO/User)'}
                          </span>
                        </div>
                      </div>

                      <div className="py-1">
                        <p className="px-2.5 py-1 text-[10px] font-bold text-[#7C7D75] uppercase tracking-wider font-display">
                          Switch Role (Demo Mode)
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            switchDemoRole('ngo');
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                            user.role === 'ngo'
                              ? 'bg-[#DD700B] text-white'
                              : 'hover:bg-black/10 text-[#1C1D1A]'
                          }`}
                        >
                          <span>NGO / Normal User (Requester)</span>
                          {user.role === 'ngo' && <span className="text-[10px]">Active</span>}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            switchDemoRole('admin');
                            setRoleMenuOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between mt-0.5 ${
                            user.role === 'admin'
                              ? 'bg-[#7C7D75] text-[#FCF8D8]'
                              : 'hover:bg-black/10 text-[#1C1D1A]'
                          }`}
                        >
                          <span>College Dean (Provider)</span>
                          {user.role === 'admin' && <span className="text-[10px]">Active</span>}
                        </button>
                      </div>

                      <div className="border-t-2 border-[#1C1D1A]/20 pt-1 mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setRoleMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-[#DD700B] hover:bg-black/10 rounded-xl font-bold flex items-center gap-1.5"
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
                  className="h-8 w-8 text-[#1C1D1A] hover:bg-[#D9DADF] rounded-xl border border-transparent hover:border-[#1C1D1A]"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link href="/user/login">
                  <button
                    type="button"
                    className="bg-[#DD700B] hover:bg-[#c25e04] text-white font-display font-extrabold text-xs py-1.5 px-3 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] flex items-center gap-1.5 cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    <LogIn className="h-3.5 w-3.5 text-white" />
                    <span>User Login</span>
                  </button>
                </Link>
                <Link href="/login?redirect=/admin" className="hidden sm:block">
                  <button
                    type="button"
                    className="bg-[#1C1D1A] hover:bg-black text-[#FCF8D8] font-display font-extrabold text-xs py-1.5 px-3 rounded-2xl border-2 border-[#1C1D1A] shadow-[2px_2px_0px_0px_#7C7D75] flex items-center gap-1.5 cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    <Lock className="h-3 w-3 text-[#FCF8D8]" />
                    <span>Dean SSO</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
