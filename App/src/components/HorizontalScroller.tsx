import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import "./HorizontalScroller.css";

type Props = {
  children: ReactNode;
  label: string;
  className?: string;
  style?: CSSProperties;
};

const DRAG_THRESHOLD = 8;

export function HorizontalScroller({ children, label, className = "", style }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startY = 0;
    let startScroll = 0;
    let axis: null | "x" | "y" = null;
    let suppressClick = false;

    const canScroll = () => scroller.scrollWidth > scroller.clientWidth + 1;

    const sync = () => {
      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const x = scroller.scrollLeft;
      setScrollable(max > 1);
      setAtStart(x <= 1);
      setAtEnd(x >= max - 1);
    };

    const reset = () => {
      pointerId = null;
      axis = null;
      scroller.classList.remove("h-scroll--dragging");
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target instanceof Element && e.target.closest(".h-scroll-nav")) return;
      if (!canScroll()) return;
      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      startScroll = scroller.scrollLeft;
      axis = null;
      suppressClick = false;
    };

    const onMove = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (axis == null) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (axis === "x") {
          suppressClick = true;
          scroller.classList.add("h-scroll--dragging");
          try {
            scroller.setPointerCapture(e.pointerId);
          } catch {
            /* ignore */
          }
        }
      }

      if (axis === "x") {
        e.preventDefault();
        scroller.scrollLeft = startScroll - dx;
      }
    };

    const onUp = (e: PointerEvent) => {
      if (pointerId !== e.pointerId) return;
      reset();
    };

    const onClickCapture = (e: MouseEvent) => {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!canScroll()) return;
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const horizontalIntent = e.shiftKey || absX > absY;
      const convertVertical = !e.shiftKey && absY > 0 && absX <= absY;
      if (!horizontalIntent && !convertVertical) return;

      const delta = horizontalIntent
        ? e.deltaX !== 0
          ? e.deltaX
          : e.deltaY
        : e.deltaY;
      if (delta === 0) return;

      const start = scroller.scrollLeft <= 0;
      const end =
        scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;
      if ((delta < 0 && start) || (delta > 0 && end)) return;

      e.preventDefault();
      scroller.scrollLeft += delta;
    };

    scroller.addEventListener("pointerdown", onDown);
    scroller.addEventListener("pointermove", onMove, { passive: false });
    scroller.addEventListener("pointerup", onUp);
    scroller.addEventListener("pointercancel", onUp);
    scroller.addEventListener("click", onClickCapture, true);
    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("scroll", sync, { passive: true });

    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
    ro?.observe(scroller);
    sync();

    return () => {
      reset();
      scroller.removeEventListener("pointerdown", onDown);
      scroller.removeEventListener("pointermove", onMove);
      scroller.removeEventListener("pointerup", onUp);
      scroller.removeEventListener("pointercancel", onUp);
      scroller.removeEventListener("click", onClickCapture, true);
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("scroll", sync);
      ro?.disconnect();
    };
  }, []);

  const stepBy = (dir: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const step = Math.max(160, Math.round(scroller.clientWidth * 0.72));
    scroller.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div
      className={`h-scroll-rail${scrollable ? " h-scroll-rail--scrollable" : ""}`}
    >
      <button
        type="button"
        className="h-scroll-nav h-scroll-nav--prev"
        aria-label={`${label}: previous`}
        disabled={!scrollable || atStart}
        onClick={() => stepBy(-1)}
      >
        ‹
      </button>
      <div
        ref={scrollerRef}
        className={`h-scroll ${className}`.trim()}
        style={style}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {children}
      </div>
      <button
        type="button"
        className="h-scroll-nav h-scroll-nav--next"
        aria-label={`${label}: next`}
        disabled={!scrollable || atEnd}
        onClick={() => stepBy(1)}
      >
        ›
      </button>
    </div>
  );
}
