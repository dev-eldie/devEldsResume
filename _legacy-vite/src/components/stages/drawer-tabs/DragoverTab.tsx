import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useLineStore, type Stage } from "@/store/useLineStore";

export function DragoverTab({ stage }: { stage: Stage }) {
  const stages = useLineStore((s) => s.stages);
  const updateStage = useLineStore((s) => s.updateStage);
  const currentIndex = stages.findIndex((s) => s.id === stage.id);

  return (
    <div className="flex flex-col gap-4 p-6">
      <Input
        label="Dragover rate"
        type="number"
        inputMode="decimal"
        suffix="%"
        value={stage.dragoverPct}
        onChange={(e) =>
          updateStage(stage.id, { dragoverPct: Number(e.target.value) })
        }
        hint="Percent of bath chemistry carried to the next stage by workpieces."
      />

      <Select
        label="Cascade from stage"
        value={stage.cascadeFromStage ?? ""}
        onChange={(e) =>
          updateStage(stage.id, {
            cascadeFromStage:
              e.target.value === "" ? null : Number(e.target.value),
          })
        }
        hint="Feeds overflow from a downstream stage back into this one."
      >
        <option value="">None</option>
        {stages.map((s, i) =>
          i === currentIndex ? null : (
            <option key={s.id} value={i + 1}>
              S{i + 1} — {s.name}
            </option>
          ),
        )}
      </Select>

      <div className="rounded-lg border border-dashed border-border p-4">
        <p className="text-xs text-text-muted leading-relaxed">
          Cascade rinsing can significantly reduce fresh water consumption in
          sequential rinse tanks. Configure each downstream rinse to feed the
          previous one.
        </p>
      </div>
    </div>
  );
}
