import type { StageType } from "./stageTypes";

export interface StageTemplate {
  type: StageType;
  name: string;
  tempC: number;
  chemKgPerH: number;
  waterLPerH: number;
  dragoverPct: number;
  cascadeFromStage: number | null;
  notes: string;
}

export const STAGE_TEMPLATES: Record<StageType, StageTemplate> = {
  degreaser: {
    type: "degreaser",
    name: "Alkaline Degreaser",
    tempC: 55,
    chemKgPerH: 4.2,
    waterLPerH: 180,
    dragoverPct: 1.2,
    cascadeFromStage: null,
    notes: "Removes oils and particulates from base metal.",
  },
  rinse: {
    type: "rinse",
    name: "Tap Water Rinse",
    tempC: 22,
    chemKgPerH: 0,
    waterLPerH: 420,
    dragoverPct: 0.8,
    cascadeFromStage: null,
    notes: "Removes drag-out chemistry from previous stage.",
  },
  "di-rinse": {
    type: "di-rinse",
    name: "DI Water Rinse",
    tempC: 22,
    chemKgPerH: 0,
    waterLPerH: 260,
    dragoverPct: 0.5,
    cascadeFromStage: null,
    notes: "Final rinse before coating. Uses deionized water.",
  },
  ecoat: {
    type: "ecoat",
    name: "Ecoat Bath",
    tempC: 32,
    chemKgPerH: 2.8,
    waterLPerH: 140,
    dragoverPct: 1.5,
    cascadeFromStage: null,
    notes: "Electrodeposition of organic coating.",
  },
  autophoretic: {
    type: "autophoretic",
    name: "Autophoretic Coating",
    tempC: 24,
    chemKgPerH: 3.1,
    waterLPerH: 120,
    dragoverPct: 1.3,
    cascadeFromStage: null,
    notes: "Chemical conversion coating — no electric current.",
  },
  oven: {
    type: "oven",
    name: "Cure Oven",
    tempC: 180,
    chemKgPerH: 0,
    waterLPerH: 0,
    dragoverPct: 0,
    cascadeFromStage: null,
    notes: "Thermal cure cycle for deposited coating.",
  },
  "water-drier": {
    type: "water-drier",
    name: "Water Drier",
    tempC: 95,
    chemKgPerH: 0,
    waterLPerH: 0,
    dragoverPct: 0,
    cascadeFromStage: null,
    notes: "Evaporates surface water before cure.",
  },
  blank: {
    type: "blank",
    name: "New Stage",
    tempC: 25,
    chemKgPerH: 0,
    waterLPerH: 0,
    dragoverPct: 0,
    cascadeFromStage: null,
    notes: "",
  },
};

export const SEED_LINE: StageType[] = [
  "degreaser",
  "rinse",
  "di-rinse",
  "autophoretic",
  "water-drier",
  "oven",
];
