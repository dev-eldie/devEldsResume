import {
  Droplets,
  Flame,
  Sparkles,
  Wind,
  Beaker,
  Waves,
  Paintbrush,
  Square,
  type LucideIcon,
} from "lucide-react";

export type StageType =
  | "degreaser"
  | "rinse"
  | "di-rinse"
  | "ecoat"
  | "autophoretic"
  | "oven"
  | "water-drier"
  | "blank";

export type StageCategory = "wet" | "chemical" | "heat" | "drier" | "blank";

export interface StageTypeMeta {
  id: StageType;
  label: string;
  category: StageCategory;
  icon: LucideIcon;
  /** Tailwind color utility root, e.g. "water", "chem", "heat" */
  accent: "water" | "chem" | "heat" | "slate" | "primary";
}

export const STAGE_TYPES: Record<StageType, StageTypeMeta> = {
  degreaser: {
    id: "degreaser",
    label: "Degreaser",
    category: "chemical",
    icon: Sparkles,
    accent: "chem",
  },
  rinse: {
    id: "rinse",
    label: "Rinse",
    category: "wet",
    icon: Droplets,
    accent: "water",
  },
  "di-rinse": {
    id: "di-rinse",
    label: "DI Rinse",
    category: "wet",
    icon: Waves,
    accent: "water",
  },
  ecoat: {
    id: "ecoat",
    label: "Ecoat",
    category: "chemical",
    icon: Paintbrush,
    accent: "primary",
  },
  autophoretic: {
    id: "autophoretic",
    label: "Autophoretic Coating",
    category: "chemical",
    icon: Beaker,
    accent: "chem",
  },
  oven: {
    id: "oven",
    label: "Oven / Cure",
    category: "heat",
    icon: Flame,
    accent: "heat",
  },
  "water-drier": {
    id: "water-drier",
    label: "Water Drier",
    category: "drier",
    icon: Wind,
    accent: "slate",
  },
  blank: {
    id: "blank",
    label: "Blank Stage",
    category: "blank",
    icon: Square,
    accent: "slate",
  },
};

export const STAGE_TYPE_LIST = Object.values(STAGE_TYPES);

/** Returns the top-strip class tokens for a given accent. */
export function accentClasses(accent: StageTypeMeta["accent"]) {
  switch (accent) {
    case "water":
      return { strip: "bg-water", icon: "text-water", soft: "bg-cyan-50" };
    case "heat":
      return { strip: "bg-heat", icon: "text-heat", soft: "bg-orange-50" };
    case "chem":
      return { strip: "bg-chem", icon: "text-chem", soft: "bg-violet-50" };
    case "primary":
      return {
        strip: "bg-primary",
        icon: "text-primary",
        soft: "bg-primary-soft",
      };
    case "slate":
    default:
      return {
        strip: "bg-slate-400",
        icon: "text-slate-500",
        soft: "bg-slate-100",
      };
  }
}
