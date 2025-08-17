import React from 'react';
import { cn } from '../../lib/utils';

export interface AnimatedContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'bounce';
  delay?: number;
  duration?: number;
  stagger?: boolean;
  staggerDelay?: number;
  children: React.ReactNode;
}

const AnimatedContainer = React.forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ 
    className, 
    animation = 'fadeIn', 
    delay = 0, 
    duration = 500, 
    stagger = false,
    staggerDelay = 100,
    children, 
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    const animationClasses = {
      fadeIn: "animate-in fade-in duration-500",
      slideUp: "animate-in slide-in-from-bottom-4 duration-500",
      slideDown: "animate-in slide-in-from-top-4 duration-500",
      slideLeft: "animate-in slide-in-from-right-4 duration-500",
      slideRight: "animate-in slide-in-from-left-4 duration-500",
      scale: "animate-in zoom-in-95 duration-500",
      bounce: "animate-in bounce-in duration-500",
    };

    const baseClasses = cn(
      "transition-all duration-300 ease-out",
      animationClasses[animation],
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      className
    );

    if (stagger && React.Children.count(children) > 1) {
      return (
        <div ref={ref} className={baseClasses} {...props}>
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className="transition-all duration-300 ease-out"
              style={{
                animationDelay: `${delay + (index * staggerDelay)}ms`,
                animationDuration: `${duration}ms`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={baseClasses}
        style={{
          animationDelay: `${delay}ms`,
          animationDuration: `${duration}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AnimatedContainer.displayName = "AnimatedContainer";

export { AnimatedContainer };
