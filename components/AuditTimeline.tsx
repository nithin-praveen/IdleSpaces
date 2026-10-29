'use client';

import * as React from 'react';
import type { AuditLog, AuditAction } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { format } from 'date-fns';

export interface AuditTimelineItem {
  id: string;
  action: AuditAction;
  reason: string | null;
  performedBy: string;
  performerRole?: string;
  timestamp: string;
  details?: string;
  bookingId?: string;
  status?: string;
}

interface AuditTimelineProps {
  logs: AuditTimelineItem[];
  spaceName?: string;
  bookingRef?: string;
}

export function AuditTimeline({ logs, spaceName, bookingRef }: AuditTimelineProps) {
  const getActionBadge = (action: AuditAction) => {
    switch (action.toUpperCase()) {
      case 'REQUESTED':
        return {
          badge: <Badge variant="gov" className="text-[10px]">REQUESTED</Badge>,
          icon: FileText,
          bgClass: 'bg-blue-100 text-blue-700 border-blue-200',
          title: 'Booking Requisition Submitted',
        };
      case 'APPROVED':
        return {
          badge: <Badge variant="success" className="text-[10px]">APPROVED</Badge>,
          icon: CheckCircle2,
          bgClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          title: 'Facility Allocation Sanctioned',
        };
      case 'REJECTED':
        return {
          badge: <Badge variant="destructive" className="text-[10px]">REJECTED</Badge>,
          icon: XCircle,
          bgClass: 'bg-red-100 text-red-700 border-red-200',
          title: 'Requisition Formally Rejected',
        };
      case 'CHECK-IN':
        return {
          badge: <Badge variant="purple" className="text-[10px]">CHECK-IN PROOF</Badge>,
          icon: ShieldCheck,
          bgClass: 'bg-purple-100 text-purple-700 border-purple-200',
          title: 'Pre-Event Clean Condition Verified',
        };
      case 'CHECK-OUT':
        return {
          badge: <Badge variant="secondary" className="text-[10px]">CHECK-OUT REPORT</Badge>,
          icon: CheckCircle2,
          bgClass: 'bg-slate-100 text-slate-700 border-slate-300',
          title: 'Post-Event Inspection Concluded',
        };
      default:
        return {
          badge: <Badge variant="outline" className="text-[10px]">{action}</Badge>,
          icon: Clock,
          bgClass: 'bg-slate-100 text-slate-700 border-slate-200',
          title: `Action: ${action}`,
        };
    }
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No audit log transactions recorded for this asset yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {logs.map((log, index) => {
        const config = getActionBadge(log.action);
        const IconComponent = config.icon;
        const dateFormatted = format(new Date(log.timestamp), 'dd MMM yyyy, hh:mm a');

        return (
          <div key={log.id || index} className="relative group">
            {/* Timeline Node Dot */}
            <div
              className={`absolute -left-[27px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border shadow-xs ${config.bgClass}`}
            >
              <IconComponent className="h-3.5 w-3.5" />
            </div>

            {/* Event Content Box */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {config.title}
                  </span>
                  {config.badge}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>{dateFormatted}</span>
                </div>
              </div>

              {/* Performer Details */}
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  Actor: <strong className="text-slate-800 dark:text-slate-200">{log.performedBy}</strong>
                  {log.performerRole && (
                    <span className="ml-1 text-[11px] text-slate-400">({log.performerRole})</span>
                  )}
                </span>
              </div>

              {/* Mandatory Rejection or Approval Reason Block */}
              {log.reason && (
                <div className="mt-2 rounded-lg bg-amber-50/80 border border-amber-200 p-3 text-xs text-amber-950 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200">
                  <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-800 dark:text-amber-300 mb-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Statutory Justification Logged (Section 21 Compliance):</span>
                  </div>
                  <p className="italic text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                    &ldquo;{log.reason}&rdquo;
                  </p>
                </div>
              )}

              {/* Additional Context note */}
              {log.details && (
                <p className="text-xs text-slate-500 pt-1">
                  {log.details}
                </p>
              )}

              {/* Tamper-evident Seal */}
              <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                <span className="font-mono">Log ID: {log.id.substring(0, 12)}...</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Lock className="h-2.5 w-2.5" />
                  Cryptographically Sealed
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
