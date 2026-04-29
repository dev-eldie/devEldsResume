import { forwardRef, useId, type SelectHTMLAttributes, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, className, id, children, ...props }, ref) => {
    const autoId = useId();
    const selectId = id ?? autoId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium uppercase tracking-wide text-text-muted"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex items-center rounded-md border border-border bg-surface h-11",
            "transition-colors duration-150 hover:border-border-strong focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          )}
        >
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full appearance-none bg-transparent pl-3 pr-9 text-sm text-text focus:outline-none cursor-pointer",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 h-4 w-4 text-text-muted"
            aria-hidden
          />
        </div>
        {hint && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";
