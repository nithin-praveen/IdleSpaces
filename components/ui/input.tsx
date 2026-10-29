import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-2xl border-2 border-[#1C1D1A] bg-[#FCF8D8]/50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1C1D1A] placeholder:text-[#7C7D75] shadow-xs focus-visible:outline-none focus-visible:border-[#DD700B] focus-visible:ring-2 focus-visible:ring-[#DD700B]/20 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
