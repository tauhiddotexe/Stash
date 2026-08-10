import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { MOTION_DURATION, animationEnabled } from "../../lib/motion";

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
  className?: string;
}

/** Counts a numeric value up/down to its latest value with a native-feeling ease. */
export function AnimatedNumber({ value, format = String, className }: AnimatedNumberProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const current = useRef({ v: value, last: value });
  const formatRef = useRef(format);
  formatRef.current = format;

  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const render = formatRef.current;
    const { v: from } = current.current;
    if (from === value || !animationEnabled()) {
      current.current = { v: value, last: value };
      node.textContent = render(value);
      return;
    }
    const proxy = { v: from };
    current.current = { v: value, last: value };
    gsap.to(proxy, {
      v: value,
      duration: MOTION_DURATION.standard,
      ease: "power1.out",
      onUpdate: () => {
        node.textContent = render(Math.round(proxy.v));
      },
    });
  }, [value]);

  return <span ref={nodeRef} className={className} aria-live="polite" />;
}