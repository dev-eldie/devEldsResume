import { useState, useEffect } from "react";
import { useLineStore } from "@/store/useLineStore";
import { Drawer } from "@/components/ui/Drawer";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { STAGE_TYPES } from "@/data/stageTypes";
import { Trash2 } from "lucide-react";
import { InputsTab } from "./drawer-tabs/InputsTab";
import { ChemistryTab } from "./drawer-tabs/ChemistryTab";
import { EnergyTab } from "./drawer-tabs/EnergyTab";
import { DragoverTab } from "./drawer-tabs/DragoverTab";

type TabId = "inputs" | "chemistry" | "energy" | "dragover";

const TABS: { id: TabId; label: string }[] = [
  { id: "inputs", label: "Inputs" },
  { id: "chemistry", label: "Chemistry" },
  { id: "energy", label: "Energy" },
  { id: "dragover", label: "Dragover" },
];

export function StageDrawer() {
  const selectedId = useLineStore((s) => s.selectedId);
  const select = useLineStore((s) => s.select);
  const stages = useLineStore((s) => s.stages);
  const removeStage = useLineStore((s) => s.removeStage);
  const duplicateStage = useLineStore((s) => s.duplicateStage);
  const [tab, setTab] = useState<TabId>("inputs");

  useEffect(() => {
    if (selectedId) setTab("inputs");
  }, [selectedId]);

  const stage = stages.find((s) => s.id === selectedId) ?? null;
  const index = stage ? stages.findIndex((s) => s.id === stage.id) : -1;

  if (!stage) return null;

  const meta = STAGE_TYPES[stage.type];

  return (
    <Drawer
      open={!!stage}
      onClose={() => select(null)}
      title={`S${index + 1} · ${stage.name}`}
      subtitle={meta.label}
    >
      <div className="flex h-full flex-col">
        <div className="px-6 pt-4">
          <Tabs tabs={TABS} value={tab} onChange={setTab} />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {tab === "inputs" && <InputsTab stage={stage} />}
          {tab === "chemistry" && <ChemistryTab stage={stage} />}
          {tab === "energy" && <EnergyTab stage={stage} />}
          {tab === "dragover" && <DragoverTab stage={stage} />}
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-border bg-surface px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeStage(stage.id)}
            className="text-danger hover:bg-red-50 hover:text-danger"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => duplicateStage(stage.id)}
            >
              Duplicate
            </Button>
            <Button variant="primary" size="sm" onClick={() => select(null)}>
              Done
            </Button>
          </div>
        </footer>
      </div>
    </Drawer>
  );
}
