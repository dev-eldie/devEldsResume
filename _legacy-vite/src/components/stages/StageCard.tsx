import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Thermometer, Beaker, Droplets } from "lucide-react";
import { useLineStore, type Stage } from "@/store/useLineStore";
import { STAGE_TYPES, accentClasses } from "@/data/stageTypes";
import { formatTemp, formatKg, formatLiters } from "@/lib/format";
import { cn } from "@/lib/cn";

interface StageCardProps {
  stage: Stage;
  index: number;
}

export function StageCard({ stage, index }: StageCardProps) {
  const meta = STAGE_TYPES[stage.type];
  const Icon = meta.icon;
  const accent = accentClasses(meta.accent);

  const selectedId = useLineStore((s) => s.selectedId);
  const select = useLineStore((s) => s.select);
  const removeStage = useLineStore((s) => s.removeStage);

  const selected = selectedId === stage.id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-stage-id={stage.id}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      aria-label={`Stage ${index + 1} ${meta.label} ${stage.name}. Press Enter to edit, Delete to remove.`}
      onClick={() => select(stage.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select(stage.id);
        } else if (e.key === "Delete" || e.key === "Backspace") {
          e.preventDefault();
          removeStage(stage.id);
        } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const dir = e.key === "ArrowRight" ? 1 : -1;
          const all = Array.from(
            document.querySelectorAll<HTMLElement>("[data-stage-id]"),
          );
          const pos = all.findIndex((el) => el.dataset.stageId === stage.id);
          const next = all[pos + dir];
          next?.focus();
        }
      }}
      className={cn(
        "group relative flex w-[220px] shrink-0 flex-col overflow-hidden rounded-lg border bg-surface shadow-card cursor-pointer outline-none",
        "transition-colors duration-150",
        selected
          ? "border-primary ring-2 ring-primary/30"
          : "border-border hover:border-border-strong",
        isDragging && "opacity-60",
      )}
    >
      <div className={cn("h-1 w-full", accent.strip)} aria-hidden />

      <div className="flex items-start justify-between gap-2 px-4 pt-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-semibold text-text-muted">
            S{index + 1}
          </span>
          <span
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md",
              accent.soft,
              accent.icon,
            )}
            aria-hidden
          >
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <button
          type="button"
          aria-label={`Drag to reorder stage ${index + 1}`}
          className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-surface-muted cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 pt-2">
        <div className="font-display text-[15px] font-semibold text-text leading-tight line-clamp-2">
          {stage.name}
        </div>
        <div className="mt-0.5 text-xs text-text-muted">{meta.label}</div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-1.5 px-4 pb-4">
        <MetricChip icon={Thermometer} value={formatTemp(stage.tempC)} />
        {stage.chemKgPerH > 0 && (
          <MetricChip icon={Beaker} value={formatKg(stage.chemKgPerH)} />
        )}
        {stage.waterLPerH > 0 && (
          <MetricChip icon={Droplets} value={formatLiters(stage.waterLPerH)} />
        )}
      </div>

      <button
        type="button"
        aria-label={`Remove stage ${index + 1}`}
        onClick={(e) => {
          e.stopPropagation();
          removeStage(stage.id);
        }}
        className="absolute right-2 top-12 hidden h-7 w-7 items-center justify-center rounded-md text-text-muted hover:bg-red-50 hover:text-danger group-hover:flex focus-visible:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function MetricChip({
  icon: Icon,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-surface-muted px-2.5 py-1.5">
      <Icon className="h-3.5 w-3.5 text-text-muted" />
      <span className="font-mono text-[12px] font-medium text-text tabular">{value}</span>
    </div>
  );
}
