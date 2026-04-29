import { useLineStore } from "@/store/useLineStore";
import { STAGE_TYPES } from "@/data/stageTypes";

/**
 * Placeholder computed totals. Not a real LCA model — just believable numbers
 * derived from stage inputs so the UI has live feedback when editing.
 */
export function useTotals() {
  const stages = useLineStore((s) => s.stages);

  let waterLPerH = 0;
  let chemKgPerH = 0;
  let heatKwhPerH = 0;
  let electricalKwhPerH = 0;

  for (const s of stages) {
    waterLPerH += s.waterLPerH;
    chemKgPerH += s.chemKgPerH;
    const cat = STAGE_TYPES[s.type].category;
    if (cat === "heat") {
      heatKwhPerH += Math.max(0, (s.tempC - 20) * 0.45);
    } else if (cat === "drier") {
      heatKwhPerH += Math.max(0, (s.tempC - 20) * 0.25);
    } else if (cat === "wet" || cat === "chemical") {
      heatKwhPerH += Math.max(0, (s.tempC - 20) * 0.12);
      electricalKwhPerH += 1.2;
    }
  }

  const totalKwh = heatKwhPerH + electricalKwhPerH;
  // Rough placeholder emission factor
  const kgCo2PerH = totalKwh * 0.42 + waterLPerH * 0.0003 + chemKgPerH * 2.1;

  return {
    stageCount: stages.length,
    waterLPerH,
    chemKgPerH,
    heatKwhPerH,
    electricalKwhPerH,
    totalKwh,
    kgCo2PerH,
  };
}
