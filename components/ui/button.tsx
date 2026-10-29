import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-xs sm:text-sm font-display font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer border-2 border-[#1C1D1A]',
  {
    variants: {
      variant: {
        default:
          'bg-[#DD700B] text-white shadow-[2px_2px_0px_0px_#1C1D1A] hover:bg-[#c96205] hover:-translate-y-0.5',
        gov:
          'bg-[#DD700B] text-white shadow-[2px_2px_0px_0px_#1C1D1A] hover:bg-[#c96205] hover:-translate-y-0.5',
        destructive:
          'bg-[#DD700B] text-white shadow-[2px_2px_0px_0px_#1C1D1A] hover:bg-red-700 hover:-translate-y-0.5',
        outline:
          'border-2 border-[#1C1D1A] bg-white text-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] hover:bg-[#D9DADF] hover:-translate-y-0.5',
        secondary:
          'bg-[#D9DADF] text-[#1C1D1A] shadow-[2px_2px_0px_0px_#1C1D1A] hover:bg-[#ADACA7] hover:-translate-y-0.5',
        ghost:
          'border-transparent hover:border-[#1C1D1A] hover:bg-[#D9DADF] text-[#1C1D1A]',
        link:
          'border-transparent text-[#DD700B] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-3.5 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
