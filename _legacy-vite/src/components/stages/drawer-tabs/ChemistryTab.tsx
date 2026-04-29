import { Input } from "@/components/ui/Input";
import { useLineStore, type Stage } from "@/store/useLineStore";

export function ChemistryTab({ stage }: { stage: Stage }) {
  const updateStage = useLineStore((s) => s.updateStage);
  return (
    <div className="flex flex-col gap-4 p-6">
      <Input
        label="Chemical consumption"
        type="number"
        inputMode="decimal"
        suffix="kg/h"
        value={stage.chemKgPerH}
        onChange={(e) =>
          updateStage(stage.id, { chemKgPerH: Number(e.target.value) })
        }
        hint="Active chemistry replenished into this tank per operating hour."
      />
      <Input
        label="Water consumption"
        type="number"
        inputMode="decimal"
        suffix="L/h"
        value={stage.waterLPerH}
        onChange={(e) =>
          updateStage(stage.id, { waterLPerH: Number(e.target.value) })
        }
        hint="DI or tap water draw for make-up and overflow."
      />

      <div className="rounded-lg border border-border bg-primary-soft/60 p-4">
        <p className="font-display text-xs font-semibold uppercase tracking-wider text-primary">
          Tip
        </p>
        <p className="mt-1 text-xs leading-relaxed text-text-muted">
          Wet stages like rinse and DI rinse should have chemistry set to zero
          unless a dosing additive is present.
        </p>
      </div>
    </div>
  );
}
