import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900',
        secondary:
          'border-transparent bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
        destructive:
          'border-transparent bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400',
        outline:
          'text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700',
        gov:
          'border-blue-200 bg-blue-50 text-blue-900 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
        success:
          'border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
        warning:
          'border-amber-200 bg-amber-50 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
        purple:
          'border-purple-200 bg-purple-50 text-purple-900 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
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
