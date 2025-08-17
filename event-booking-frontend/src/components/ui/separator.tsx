import React from 'react';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = 'horizontal', className = '' }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          shrink-0 bg-border
          ${orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px'}
          ${className}
        `}
      />
    );
  }
);

Separator.displayName = 'Separator';

export { Separator };
