import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useLineStore, type Stage } from "@/store/useLineStore";
import { STAGE_TYPE_LIST } from "@/data/stageTypes";

export function InputsTab({ stage }: { stage: Stage }) {
  const updateStage = useLineStore((s) => s.updateStage);
  return (
    <div className="flex flex-col gap-4 p-6">
      <Input
        label="Stage name"
        value={stage.name}
        onChange={(e) => updateStage(stage.id, { name: e.target.value })}
      />
      <Select
        label="Stage type"
        value={stage.type}
        onChange={(e) =>
          updateStage(stage.id, { type: e.target.value as Stage["type"] })
        }
      >
        {STAGE_TYPE_LIST.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label}
          </option>
        ))}
      </Select>
      <Input
        label="Operating temperature"
        type="number"
        inputMode="decimal"
        suffix="°C"
        value={stage.tempC}
        onChange={(e) => updateStage(stage.id, { tempC: Number(e.target.value) })}
      />
      <div className="rounded-md bg-surface-muted p-3">
        <label className="text-xs font-medium uppercase tracking-wide text-text-muted">
          Notes
        </label>
        <textarea
          value={stage.notes}
          onChange={(e) => updateStage(stage.id, { notes: e.target.value })}
          rows={3}
          className="mt-1.5 w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Operator notes, assumptions, references…"
        />
      </div>
    </div>
  );
}
