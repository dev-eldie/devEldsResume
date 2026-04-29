import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { STAGE_TYPE_LIST } from "@/data/stageTypes";
import { useLineStore } from "@/store/useLineStore";
import type { StageType } from "@/data/stageTypes";
import { cn } from "@/lib/cn";

interface Props {
  afterIndex: number | null;
  label?: string;
}

export function InsertStageButton({ afterIndex, label = "Add stage" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const addStage = useLineStore((s) => s.addStage);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handlePick = (type: StageType) => {
    addStage(type, afterIndex);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative flex h-[260px] shrink-0 items-center">
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group flex h-11 w-11 items-center justify-center rounded-full border border-dashed border-border-strong bg-surface text-text-muted cursor-pointer transition-colors duration-150",
          "hover:border-primary hover:bg-primary-soft hover:text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          open && "border-primary bg-primary-soft text-primary",
        )}
      >
        <Plus className="h-5 w-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-30 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-surface shadow-drawer animate-fade-in"
        >
          <div className="border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Insert stage
          </div>
          <ul className="max-h-80 overflow-y-auto py-1 scrollbar-thin">
            {STAGE_TYPE_LIST.map((t) => {
              const Icon = t.icon;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handlePick(t.id)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-text hover:bg-surface-muted cursor-pointer focus-visible:outline-none focus-visible:bg-surface-muted"
                  >
                    <Icon className="h-4 w-4 text-text-muted" />
                    <span className="flex-1">{t.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
