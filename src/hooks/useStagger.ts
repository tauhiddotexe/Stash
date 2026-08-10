import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MOTION_DURATION, animationEnabled } from "../lib/motion";

interface UseStaggerOptions {
  stagger?: number;
  y?: number;
  duration?: number;
  limit?: number;
}

/**
 * Staggers in direct children marked with `data-stagger-item` under `ref`.
 * Re-runs when any dependency changes; no-ops under reduced motion.
 */
export function useStagger(
  ref: RefObject<HTMLElement | null>,
  deps: readonly unknown[],
  options: UseStaggerOptions = {},
) {
  const { stagger = 0.045, y = 10, duration = MOTION_DURATION.standard, limit } = options;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !animationEnabled()) return;
      const items = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-stagger-item]"));
      const target = limit !== undefined ? items.slice(0, limit) : items;
      if (target.length === 0) return;
      gsap.from(target, {
        opacity: 0,
        y,
        duration,
        stagger,
        ease: "power2.out",
        overwrite: true,
      });
    },
    { scope: ref, dependencies: [...deps, stagger, y, duration, limit], revertOnUpdate: true },
  );
}