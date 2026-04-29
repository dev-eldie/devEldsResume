import { Layers, Zap, Droplets, Cloud } from "lucide-react";
import { useTotals } from "@/hooks/useTotals";
import { formatKwh, formatLiters, formatKgCo2, formatNumber } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

interface MetricProps {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: string;
}

function Metric({ icon: Icon, label, value, accent }: MetricProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 min-w-[180px]">
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-md", accent)}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
          {label}
        </div>
        <div className="font-mono text-sm font-semibold text-text tabular truncate">
          {value}
        </div>
      </div>
    </div>
  );
}

export function LineSummary() {
  const t = useTotals();
  return (
    <div className="border-b border-border bg-bg px-6 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <Metric
          icon={Layers}
          label="Stages"
          value={formatNumber(t.stageCount)}
          accent="bg-primary-soft text-primary"
        />
        <Metric
          icon={Zap}
          label="Total energy"
          value={formatKwh(t.totalKwh)}
          accent="bg-orange-50 text-heat"
        />
        <Metric
          icon={Droplets}
          label="Water draw"
          value={formatLiters(t.waterLPerH)}
          accent="bg-cyan-50 text-water"
        />
        <Metric
          icon={Cloud}
          label="CO₂ footprint"
          value={formatKgCo2(t.kgCo2PerH)}
          accent="bg-slate-100 text-slate-700"
        />
        <div className="ml-auto hidden md:block text-xs text-text-muted">
          Placeholder totals — not a calibrated LCA model.
        </div>
      </div>
    </div>
  );
}
