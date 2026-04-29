import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: ReactNode;
  suffix?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, suffix, error, className, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-xs font-medium uppercase tracking-wide text-text-muted"
        >
          {label}
        </label>
        <div
          className={cn(
            "flex items-center gap-2 rounded-md border bg-surface px-3 h-11",
            "transition-colors duration-150",
            error
              ? "border-danger"
              : "border-border hover:border-border-strong focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          )}
        >
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "flex-1 bg-transparent text-sm text-text placeholder:text-text-muted/60 focus:outline-none tabular",
              className,
            )}
            {...props}
          />
          {suffix && (
            <span className="text-xs font-medium text-text-muted tabular">{suffix}</span>
          )}
        </div>
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";
