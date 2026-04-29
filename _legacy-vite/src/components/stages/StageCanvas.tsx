import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useLineStore } from "@/store/useLineStore";
import { StageCard } from "./StageCard";
import { InsertStageButton } from "./InsertStageButton";

export function StageCanvas() {
  const stages = useLineStore((s) => s.stages);
  const reorder = useLineStore((s) => s.reorder);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = stages.findIndex((s) => s.id === active.id);
    const to = stages.findIndex((s) => s.id === over.id);
    reorder(from, to);
  };

  return (
    <div className="h-full min-h-0 overflow-auto scrollbar-thin">
      <div className="flex min-h-full flex-col">
        <div className="flex items-baseline justify-between px-6 pt-6">
          <div>
            <h1 className="font-display text-xl font-semibold text-text">
              Stage Configuration
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              Build the coating line left-to-right. Click a stage to edit its inputs.
            </p>
          </div>
          <div className="hidden text-xs text-text-muted md:block">
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
              ←
            </kbd>{" "}
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
              →
            </kbd>{" "}
            navigate{"  "}
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
              Enter
            </kbd>{" "}
            edit{"  "}
            <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
              Del
            </kbd>{" "}
            remove
          </div>
        </div>

        <div className="flex-1 min-h-0 px-6 py-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={stages.map((s) => s.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex items-center gap-2 pb-6 max-lg:flex-col max-lg:items-stretch">
                <InsertStageButton afterIndex={-1} label="Add stage at start" />
                {stages.map((stage, i) => (
                  <div key={stage.id} className="flex items-center gap-2 max-lg:flex-col">
                    <StageCard stage={stage} index={i} />
                    <InsertStageButton afterIndex={i} label={`Add stage after S${i + 1}`} />
                  </div>
                ))}
                {stages.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-border px-8 py-12 text-center text-sm text-text-muted">
                    No stages yet. Click the + button to add one.
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
