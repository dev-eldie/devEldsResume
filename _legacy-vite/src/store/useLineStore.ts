import { create } from "zustand";
import { STAGE_TEMPLATES, SEED_LINE } from "@/data/stageTemplates";
import type { StageType } from "@/data/stageTypes";

export interface Stage {
  id: string;
  name: string;
  type: StageType;
  tempC: number;
  chemKgPerH: number;
  waterLPerH: number;
  dragoverPct: number;
  cascadeFromStage: number | null;
  notes: string;
}

interface LineState {
  projectName: string;
  stages: Stage[];
  selectedId: string | null;
  setProjectName: (name: string) => void;
  select: (id: string | null) => void;
  addStage: (type: StageType, afterIndex: number | null) => void;
  removeStage: (id: string) => void;
  updateStage: (id: string, patch: Partial<Stage>) => void;
  reorder: (from: number, to: number) => void;
  duplicateStage: (id: string) => void;
}

let counter = 0;
const uid = () => `stage_${Date.now().toString(36)}_${(counter++).toString(36)}`;

function seedStages(): Stage[] {
  return SEED_LINE.map((type) => {
    const t = STAGE_TEMPLATES[type];
    return { id: uid(), ...t };
  });
}

export const useLineStore = create<LineState>((set) => ({
  projectName: "Line A — North Plant",
  stages: seedStages(),
  selectedId: null,

  setProjectName: (projectName) => set({ projectName }),

  select: (selectedId) => set({ selectedId }),

  addStage: (type, afterIndex) =>
    set((state) => {
      const template = STAGE_TEMPLATES[type];
      const newStage: Stage = { id: uid(), ...template };
      const insertAt =
        afterIndex === null ? state.stages.length : afterIndex + 1;
      const stages = [
        ...state.stages.slice(0, insertAt),
        newStage,
        ...state.stages.slice(insertAt),
      ];
      return { stages, selectedId: newStage.id };
    }),

  removeStage: (id) =>
    set((state) => ({
      stages: state.stages.filter((s) => s.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  updateStage: (id, patch) =>
    set((state) => ({
      stages: state.stages.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    })),

  reorder: (from, to) =>
    set((state) => {
      if (from === to || from < 0 || to < 0) return state;
      const stages = [...state.stages];
      const [moved] = stages.splice(from, 1);
      stages.splice(to, 0, moved);
      return { stages };
    }),

  duplicateStage: (id) =>
    set((state) => {
      const idx = state.stages.findIndex((s) => s.id === id);
      if (idx === -1) return state;
      const original = state.stages[idx];
      const copy: Stage = { ...original, id: uid(), name: `${original.name} (copy)` };
      const stages = [
        ...state.stages.slice(0, idx + 1),
        copy,
        ...state.stages.slice(idx + 1),
      ];
      return { stages, selectedId: copy.id };
    }),
}));
