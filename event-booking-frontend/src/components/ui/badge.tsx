import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 ease-in-out hover:scale-105 transform-gpu",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-lg",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:shadow-lg",
        outline: "text-foreground hover:bg-accent hover:text-accent-foreground",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600 hover:shadow-lg",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-lg",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg",
        glass: "bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:shadow-xl",
        gradient: "bg-gradient-to-r from-primary to-primary/80 text-white border-transparent hover:from-primary/90 hover:to-primary/70 hover:shadow-xl",
        glow: "border-transparent bg-primary text-primary-foreground shadow-lg hover:shadow-primary/50 hover:shadow-xl",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        spin: "animate-spin",
        ping: "animate-ping",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, animation, icon, iconPosition = 'left', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, animation, className }))}
        {...props}
      >
        {icon && iconPosition === 'left' && (
          <span className="mr-1.5 transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}
        <span className="transition-all duration-200">
          {children}
        </span>
        {icon && iconPosition === 'right' && (
          <span className="ml-1.5 transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
