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
        'p-3 border border-slate-200 rounded-xl bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 select-none w-full max-w-[320px]',
        className
      )}
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between px-1 py-1 mb-2">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {format(currentMonth, 'MMMM yyyy')}
        </h4>
        <div className="flex items-center space-x-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-400 dark:text-slate-500 mb-1">
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
                'h-8 w-8 mx-auto flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer',
                !isCurrentMonth && 'text-slate-300 dark:text-slate-700 pointer-events-none',
                isCurrentMonth && !isSelected && 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                isCurrentDay && !isSelected && 'border border-blue-500 font-bold text-blue-600 dark:text-blue-400',
                isSelected && 'bg-blue-900 text-white font-semibold hover:bg-blue-800 shadow-sm',
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
        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 cursor-pointer"
      />
    </div>
  );
}
