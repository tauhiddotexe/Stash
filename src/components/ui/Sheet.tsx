import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MOTION_DURATION, animationEnabled } from "../../lib/motion";

gsap.registerPlugin(useGSAP);

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  showHandle?: boolean;
}

const DRAG_TO_CLOSE = 90;

/** iOS-style bottom sheet with backdrop + drag-down-to-dismiss. */
export function Sheet({ open, onClose, children, title, showHandle = true }: SheetProps) {
  const [offsetY, setOffsetY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!open || !animationEnabled()) return;
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: MOTION_DURATION.standard, ease: "power2.out" },
      );
      gsap.fromTo(
        panelRef.current,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: MOTION_DURATION.enter,
          ease: "expo.out",
          clearProps: "transform",
        },
      );
    },
    { scope: panelRef, dependencies: [open] },
  );

  useEffect(() => {
    if (open) setOffsetY(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const onHandleDown = (e: ReactPointerEvent) => {
    startY.current = e.clientY;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onHandleMove = (e: ReactPointerEvent) => {
    if (!dragging) return;
    const dy = e.clientY - startY.current;
    if (dy > 0) setOffsetY(dy);
  };

  const onHandleUp = () => {
    setDragging(false);
    const shouldClose = offsetY > DRAG_TO_CLOSE;
    setOffsetY(shouldClose ? window.innerHeight : 0);
    if (shouldClose) {
      window.setTimeout(onClose, 180);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        ref={backdropRef}
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-fade-in"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={[
          "relative w-full max-w-lg",
          "rounded-t-iossheet bg-sheet",
          "shadow-elevated",
          "flex flex-col",
        ].join(" ")}
        style={{
          transform: dragging || offsetY > 0 ? `translateY(${offsetY}px)` : undefined,
          transition: dragging ? "none" : "transform 300ms cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        <div
          className="h-11 flex shrink-0 items-start justify-center pt-2.5 cursor-grab active:cursor-grabbing select-none"
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          onPointerCancel={onHandleUp}
        >
          {showHandle ? <div className="h-1.5 w-10 rounded-full bg-separator" /> : null}
        </div>
        <div className="overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] max-h-[82vh]">
          {children}
        </div>
      </div>
    </div>
  );
}