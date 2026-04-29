import { Thermometer, Zap } from "lucide-react";
import { type Stage } from "@/store/useLineStore";
import { STAGE_TYPES } from "@/data/stageTypes";
import { formatKwh } from "@/lib/format";

export function EnergyTab({ stage }: { stage: Stage }) {
  const cat = STAGE_TYPES[stage.type].category;
  let heat = 0;
  let electrical = 0;
  if (cat === "heat") heat = Math.max(0, (stage.tempC - 20) * 0.45);
  else if (cat === "drier") heat = Math.max(0, (stage.tempC - 20) * 0.25);
  else if (cat === "wet" || cat === "chemical") {
    heat = Math.max(0, (stage.tempC - 20) * 0.12);
    electrical = 1.2;
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="rounded-lg border border-border bg-surface-muted p-4">
        <p className="text-xs text-text-muted leading-relaxed">
          Energy is derived from the stage type and operating temperature. Edit
          the temperature on the <strong className="text-text">Inputs</strong> tab
          to see this update.
        </p>
      </div>

      <Readout
        icon={<Thermometer className="h-5 w-5 text-heat" />}
        label="Heat energy"
        value={formatKwh(heat)}
      />
      <Readout
        icon={<Zap className="h-5 w-5 text-orange-600" />}
        label="Electrical energy"
        value={formatKwh(electrical)}
      />
      <Readout
        icon={<Zap className="h-5 w-5 text-primary" />}
        label="Total stage energy"
        value={formatKwh(heat + electrical)}
        emphasis
      />
    </div>
  );
}

function Readout({
  icon,
  label,
  value,
  emphasis,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={
        "flex items-center justify-between rounded-md border border-border bg-surface px-4 py-3 " +
        (emphasis ? "ring-1 ring-primary/30" : "")
      }
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-muted">
          {icon}
        </div>
        <span className="text-sm font-medium text-text">{label}</span>
      </div>
      <span className="font-mono text-sm font-semibold text-text tabular">{value}</span>
    </div>
  );
}
