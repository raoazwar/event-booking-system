import React from 'react';
import { cn } from '../../lib/utils';

export interface HoverCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  trigger: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  openDelay?: number;
  closeDelay?: number;
  className?: string;
}

const HoverCard = React.forwardRef<HTMLDivElement, HoverCardProps>(
  ({ 
    trigger, 
    content, 
    side = 'top', 
    align = 'center',
    sideOffset = 8,
    alignOffset = 0,
    openDelay = 200,
    closeDelay = 300,
    className,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setIsOpen(true), openDelay);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setIsOpen(false), closeDelay);
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const positionClasses = {
      top: 'bottom-full mb-2',
      right: 'left-full ml-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2',
    };

    const alignClasses = {
      start: side === 'top' || side === 'bottom' ? 'left-0' : 'top-0',
      center: side === 'top' || side === 'bottom' ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2',
      end: side === 'top' || side === 'bottom' ? 'right-0' : 'bottom-0',
    };

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {trigger}
        
        {isOpen && (
          <div
            className={cn(
              "absolute z-50",
              positionClasses[side],
              alignClasses[align],
              "animate-in fade-in-0 zoom-in-95 duration-200"
            )}
            style={{
              marginTop: side === 'bottom' ? sideOffset : undefined,
              marginBottom: side === 'top' ? sideOffset : undefined,
              marginLeft: side === 'right' ? sideOffset : undefined,
              marginRight: side === 'left' ? sideOffset : undefined,
            }}
          >
            <div className="bg-popover text-popover-foreground rounded-md border shadow-lg p-4 min-w-[200px] max-w-[300px]">
              {content}
            </div>
          </div>
        )}
      </div>
    );
  }
);

HoverCard.displayName = "HoverCard";

export { HoverCard };
