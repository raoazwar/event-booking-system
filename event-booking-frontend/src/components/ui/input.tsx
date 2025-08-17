import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: 'default' | 'floating' | 'outlined';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, variant = 'default', icon, iconPosition = 'left', ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    const baseClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200 ease-in-out";
    const focusClasses = "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-ring";
    const errorClasses = error ? "border-destructive focus:ring-destructive" : "";
    const iconClasses = icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : '';

    if (variant === 'floating') {
      return (
        <div className="relative">
          <div className="relative">
            {icon && iconPosition === 'left' && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200">
                {icon}
              </div>
            )}
            <input
              type={type}
              className={cn(
                baseClasses,
                focusClasses,
                errorClasses,
                iconClasses,
                "peer placeholder-transparent",
                className
              )}
              ref={ref}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              {...props}
            />
            {icon && iconPosition === 'right' && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200">
                {icon}
              </div>
            )}
            {label && (
              <label
                className={cn(
                  "absolute left-3 top-2 text-sm text-muted-foreground transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary",
                  iconPosition === 'left' && "left-10",
                  (isFocused || hasValue) && "-top-2 text-xs text-primary"
                )}
              >
                {label}
              </label>
            )}
          </div>
          {error && (
            <p className="mt-1 text-xs text-destructive animate-in slide-in-from-top-1 duration-200">
              {error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              baseClasses,
              focusClasses,
              errorClasses,
              iconClasses,
              "hover:border-ring/50",
              className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-destructive animate-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
