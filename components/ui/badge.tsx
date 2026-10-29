import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-display font-extrabold transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-[#1C1D1A] bg-[#1C1D1A] text-[#FCF8D8]',
        secondary:
          'border-[#1C1D1A] bg-[#D9DADF] text-[#1C1D1A]',
        destructive:
          'border-[#1C1D1A] bg-[#DD700B] text-white',
        outline:
          'text-[#1C1D1A] border-[#1C1D1A] bg-white',
        gov:
          'border-[#1C1D1A] bg-[#7C7D75] text-[#FCF8D8]',
        success:
          'border-[#1C1D1A] bg-[#DD700B] text-white',
        warning:
          'border-[#1C1D1A] bg-[#FCF8D8] text-[#1C1D1A]',
        purple:
          'border-[#1C1D1A] bg-[#7C7D75] text-[#FCF8D8]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
