import { useCallback, useEffect, useRef, type ReactNode } from "react";
import "./HorizontalPager.css";

type Props = {
  children: ReactNode[];
  onIndexChange?: (index: number) => void;
};

const INTERACTIVE = "button, a, input, select, textarea, label, [role='button']";

export function HorizontalPager({ children, onIndexChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const el = ref.current;
      if (!el) return;
      const width = el.clientWidth || 1;
      const i = Math.max(0, Math.min(children.length - 1, index));
      el.scrollTo({ left: width * i, behavior });
      onIndexChange?.(i);
    },
    [children.length, onIndexChange],
  );

  useEffect(() => {
    const pager = ref.current;
    if (!pager) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let startScroll = 0;
    let axis: null | "x" | "y" = null;

    const reset = () => {
      pointerId = null;
      axis = null;
      pager.classList.remove("h-pager--dragging");
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      startScroll = pager.scrollLeft;
      axis = null;
    };

    const onMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (axis == null) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (axis === "x") {
          pager.classList.add("h-pager--dragging");
          try {
            pager.setPointerCapture(e.pointerId);
          } catch {
            /* ignore */
          }
        }
      }

      if (axis === "x") {
        e.preventDefault();
        pager.scrollLeft = startScroll - dx;
      }
    };

    const onUp = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;
      const width = pager.clientWidth || 1;
      const startIndex = Math.round(startScroll / width);
      const wasX = axis === "x";
      reset();
      if (!wasX) return;

      const threshold = Math.min(56, width * 0.18);
      if (dx <= -threshold) scrollToIndex(startIndex + 1);
      else if (dx >= threshold) scrollToIndex(startIndex - 1);
      else scrollToIndex(startIndex);
    };

    const onKey = (e: KeyboardEvent) => {
      const width = pager.clientWidth || 1;
      const index = Math.round(pager.scrollLeft / width);
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        scrollToIndex(index + 1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        scrollToIndex(index - 1);
      }
    };

    pager.addEventListener("pointerdown", onDown);
    pager.addEventListener("pointermove", onMove, { passive: false });
    pager.addEventListener("pointerup", onUp);
    pager.addEventListener("pointercancel", onUp);
    window.addEventListener("keydown", onKey);

    return () => {
      reset();
      pager.removeEventListener("pointerdown", onDown);
      pager.removeEventListener("pointermove", onMove);
      pager.removeEventListener("pointerup", onUp);
      pager.removeEventListener("pointercancel", onUp);
      window.removeEventListener("keydown", onKey);
    };
  }, [children.length, scrollToIndex]);

  return (
    <div className="h-pager" ref={ref} role="region" aria-label="Pitch slides">
      {children.map((child, i) => (
        <section className="h-pager__page" key={i} data-slide={i}>
          {child}
        </section>
      ))}
    </div>
  );
}
