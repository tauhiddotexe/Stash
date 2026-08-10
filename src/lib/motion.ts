import gsap from "gsap";

/** Central motion tokens — ease curves and durations shared across Stash. */
export const EASE = {
  standard: "power3.out",
  spring: "expo.out",
  exit: "power2.inOut",
} as const;

export const MOTION_DURATION = {
  instant: 0.12,
  quick: 0.22,
  standard: 0.32,
  enter: 0.48,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface AnimationOptions {
  gsap: typeof gsap;
  duration?: number;
  stagger?: number;
  ease?: string;
}

/** Respects the reduced-motion preference; no-ops entirely when it is set. */
export function animationEnabled(): boolean {
  return !prefersReducedMotion();
}