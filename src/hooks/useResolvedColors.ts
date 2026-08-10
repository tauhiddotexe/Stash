import { useMemo } from "react";
import { CATEGORIES } from "../lib/categories";
import { useTheme } from "../state/theme";

export interface ResolvedColors {
  category: Record<string, string>;
  accent: string;
  labelTertiary: string;
}

/** Resolve theme-adaptive CSS variable colors to concrete hex strings for SVG/Recharts. */
export function useResolvedColors(): ResolvedColors {
  const { resolved } = useTheme();
  return useMemo(() => {
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;left:-9999px;";
    probe.className = resolved === "dark" ? "dark" : "";
    document.documentElement.appendChild(probe);
    const cs = window.getComputedStyle(probe);
    const read = (v: string) => {
      const val = cs.getPropertyValue(v).trim();
      return val && val !== "initial" ? val : "#8e8e93";
    };
    const category: Record<string, string> = {};
    for (const c of CATEGORIES) category[c.id] = read(c.colorVar);
    const colors = {
      category,
      accent: read("--accent"),
      labelTertiary: "rgba(120,120,128,0.6)",
    };
    probe.remove();
    return colors;
  }, [resolved]);
}