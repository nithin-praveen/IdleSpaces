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
          bgClass: 'bg-[#D9DADF] text-[#1C1D1A] border-2 border-[#1C1D1A]',
          title: 'Booking Requisition Submitted',
        };
      case 'APPROVED':
        return {
          badge: <Badge variant="success" className="text-[10px]">APPROVED</Badge>,
          icon: CheckCircle2,
          bgClass: 'bg-[#DD700B] text-white border-2 border-[#1C1D1A]',
          title: 'Facility Allocation Sanctioned',
        };
      case 'REJECTED':
        return {
          badge: <Badge variant="destructive" className="text-[10px]">REJECTED</Badge>,
          icon: XCircle,
          bgClass: 'bg-[#1C1D1A] text-[#FCF8D8] border-2 border-[#1C1D1A]',
          title: 'Requisition Formally Rejected',
        };
      case 'CHECK-IN':
        return {
          badge: <Badge variant="purple" className="text-[10px]">CHECK-IN PROOF</Badge>,
          icon: ShieldCheck,
          bgClass: 'bg-[#FCF8D8] text-[#1C1D1A] border-2 border-[#1C1D1A]',
          title: 'Pre-Event Condition Verified',
        };
      case 'CHECK-OUT':
        return {
          badge: <Badge variant="secondary" className="text-[10px]">CHECK-OUT REPORT</Badge>,
          icon: CheckCircle2,
          bgClass: 'bg-white text-[#1C1D1A] border-2 border-[#1C1D1A]',
          title: 'Post-Event Inspection Concluded',
        };
      default:
        return {
          badge: <Badge variant="outline" className="text-[10px]">{action}</Badge>,
          icon: Clock,
          bgClass: 'bg-[#D9DADF] text-[#1C1D1A] border-2 border-[#1C1D1A]',
          title: `Action: ${action}`,
        };
    }
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="p-8 text-center text-[#7C7D75] text-xs font-semibold">
        No audit log transactions recorded for this asset yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1C1D1A]/20">
      {logs.map((log, index) => {
        const config = getActionBadge(log.action);
        const IconComponent = config.icon;
        const dateFormatted = format(new Date(log.timestamp), 'dd MMM yyyy, hh:mm a');

        return (
          <div key={log.id || index} className="relative group">
            {/* Timeline Node Dot */}
            <div
              className={`absolute -left-[27px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full shadow-[1px_1px_0px_#1C1D1A] ${config.bgClass}`}
            >
              <IconComponent className="h-3.5 w-3.5" />
            </div>

            {/* Event Content Box */}
            <div className="rounded-2xl border-2 border-[#1C1D1A] bg-white p-4 shadow-[3px_3px_0px_0px_#1C1D1A] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-display font-extrabold text-[#1C1D1A]">
                    {config.title}
                  </span>
                  {config.badge}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#7C7D75]">
                  <Clock className="h-3 w-3" />
                  <span>{dateFormatted}</span>
                </div>
              </div>

              {/* Performer Details */}
              <div className="flex items-center gap-2 text-xs text-[#1C1D1A]">
                <User className="h-3.5 w-3.5 text-[#7C7D75]" />
                <span>
                  Actor: <strong className="font-extrabold text-[#1C1D1A]">{log.performedBy}</strong>
                  {log.performerRole && (
                    <span className="ml-1 text-[11px] text-[#7C7D75]">({log.performerRole})</span>
                  )}
                </span>
              </div>

              {/* Mandatory Rejection or Approval Reason Block */}
              {log.reason && (
                <div className="mt-2 rounded-xl bg-[#FCF8D8] border-2 border-[#1C1D1A] p-3 text-xs text-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A]">
                  <div className="flex items-center gap-1.5 font-display font-extrabold text-[11px] text-[#DD700B] mb-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Statutory Justification Logged (Section 21 Compliance):</span>
                  </div>
                  <p className="italic text-[#1C1D1A] leading-relaxed">
                    &ldquo;{log.reason}&rdquo;
                  </p>
                </div>
              )}

              {/* Additional Context note */}
              {log.details && (
                <p className="text-xs text-[#7C7D75] pt-1 font-medium">
                  {log.details}
                </p>
              )}

              {/* Tamper-evident Seal */}
              <div className="pt-2 flex items-center justify-between text-[10px] text-[#7C7D75] border-t border-[#1C1D1A]/10">
                <span className="font-mono">Log ID: {log.id.substring(0, 12)}...</span>
                <span className="flex items-center gap-1 text-[#DD700B] font-extrabold">
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
