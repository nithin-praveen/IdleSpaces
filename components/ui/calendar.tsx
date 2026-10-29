'use client';

import * as React from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface CalendarProps {
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function Calendar({
  selected,
  onSelect,
  minDate,
  maxDate,
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    () => selected || new Date(2026, 0, 1)
  );
  const [today, setToday] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const now = new Date();
    setToday(now);
    if (!selected) {
      setCurrentMonth(now);
    }
  }, [selected]);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div
      className={cn(
        'p-3 border-2 border-[#1C1D1A] rounded-2xl bg-white shadow-[3px_3px_0px_0px_#1C1D1A] select-none w-full max-w-[320px]',
        className
      )}
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between px-1 py-1 mb-2">
        <h4 className="text-sm font-display font-extrabold text-[#1C1D1A]">
          {format(currentMonth, 'MMMM yyyy')}
        </h4>
        <div className="flex items-center space-x-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#1C1D1A] hover:bg-[#D9DADF] rounded-lg"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-[#1C1D1A] hover:bg-[#D9DADF] rounded-lg"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-display font-extrabold text-[#7C7D75] mb-1">
        {weekDays.map((d) => (
          <div key={d} className="h-7 flex items-center justify-center">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {days.map((day) => {
          const isSelected = selected ? isSameDay(day, selected) : false;
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isPast = minDate ? isBefore(day, startOfDay(minDate)) : false;
          const isFutureBeyond = maxDate ? isBefore(maxDate, day) : false;
          const disabled = !isCurrentMonth || isPast || isFutureBeyond;
          const isCurrentDay = today ? isSameDay(day, today) : false;

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onSelect?.(day)}
              className={cn(
                'h-8 w-8 mx-auto flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer border',
                !isCurrentMonth && 'text-[#ADACA7] border-transparent pointer-events-none',
                isCurrentMonth && !isSelected && 'text-[#1C1D1A] border-transparent hover:bg-[#D9DADF]',
                isCurrentDay && !isSelected && 'border-[#DD700B] font-extrabold text-[#DD700B] bg-[#DD700B]/10',
                isSelected && 'bg-[#DD700B] text-white font-extrabold border-[#1C1D1A] shadow-[1px_1px_0px_#1C1D1A]',
                disabled && 'opacity-30 cursor-not-allowed pointer-events-none'
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export interface DatePickerProps {
  id?: string;
  label?: string;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  minDate?: string; // YYYY-MM-DD
  placeholder?: string;
  required?: boolean;
}

export function DatePicker({
  id,
  value,
  onChange,
  minDate,
  required,
}: DatePickerProps) {
  return (
    <div className="relative">
      <input
        id={id}
        type="date"
        value={value}
        min={minDate}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-11 w-full rounded-2xl border-2 border-[#1C1D1A] bg-[#FCF8D8]/50 px-3.5 py-2 text-xs sm:text-sm text-[#1C1D1A] font-semibold focus:outline-hidden focus:border-[#DD700B] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      />
    </div>
  );
}
