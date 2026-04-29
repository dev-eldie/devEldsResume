import { SlidersHorizontal, Layers, BarChart3, GitCompare, Leaf } from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { id: "input", label: "Generic Input", icon: SlidersHorizontal, disabled: true },
  { id: "stages", label: "Stages", icon: Layers, disabled: false },
  { id: "results", label: "Results", icon: BarChart3, disabled: true },
  { id: "compare", label: "Compare", icon: GitCompare, disabled: true },
] as const;

export function Sidebar() {
  return (
    <aside
      className="flex w-60 flex-col border-r border-border bg-surface max-lg:hidden"
      aria-label="Primary navigation"
    >
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-soft text-primary">
          <Leaf className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-sm font-semibold text-text">LCA Studio</div>
          <div className="text-[11px] text-text-muted">Line Assessment</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.id === "stages";
          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 h-11 text-sm font-medium text-left transition-colors duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                active
                  ? "bg-primary-soft text-primary"
                  : "text-text-muted hover:bg-surface-muted hover:text-text",
                item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto p-3">
        <div className="rounded-lg border border-border bg-surface-muted p-4">
          <p className="font-display text-xs font-semibold text-text">Prototype build</p>
          <p className="mt-1 text-[11px] leading-relaxed text-text-muted">
            Stage configuration redesign. Inputs drive live placeholder totals only.
          </p>
        </div>
      </div>
    </aside>
  );
}
