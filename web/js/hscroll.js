/**
 * Reliable horizontal scrolling for .h-scroll carousels.
 * Native overflow-x fights nested vertical scroll / button children / touch-action.
 */

const DRAG_THRESHOLD = 8;

/**
 * @param {HTMLElement} scroller
 * @param {{ step?: number }} [options]
 */
export function bindHorizontalScroller(scroller, options = {}) {
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startScroll = 0;
  let axis = null; // null | "x" | "y"
  let suppressClick = false;

  const canScroll = () => scroller.scrollWidth > scroller.clientWidth + 1;

  const stepBy = (dir) => {
    const step =
      options.step ??
      Math.max(160, Math.round(scroller.clientWidth * 0.72));
    scroller.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const reset = () => {
    pointerId = null;
    axis = null;
    scroller.classList.remove("h-scroll--dragging");
  };

  const onDown = (e) => {
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

  const onMove = (e) => {
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

  const onUp = (e) => {
    if (pointerId !== e.pointerId) return;
    reset();
  };

  const onClickCapture = (e) => {
    if (!suppressClick) return;
    e.preventDefault();
    e.stopPropagation();
    suppressClick = false;
  };

  const onWheel = (e) => {
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

    const atStart = scroller.scrollLeft <= 0;
    const atEnd =
      scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;
    if ((delta < 0 && atStart) || (delta > 0 && atEnd)) return;

    e.preventDefault();
    scroller.scrollLeft += delta;
  };

  scroller.addEventListener("pointerdown", onDown);
  scroller.addEventListener("pointermove", onMove, { passive: false });
  scroller.addEventListener("pointerup", onUp);
  scroller.addEventListener("pointercancel", onUp);
  scroller.addEventListener("click", onClickCapture, true);
  scroller.addEventListener("wheel", onWheel, { passive: false });

  return {
    stepBy,
    canScroll,
    destroy() {
      reset();
      scroller.removeEventListener("pointerdown", onDown);
      scroller.removeEventListener("pointermove", onMove);
      scroller.removeEventListener("pointerup", onUp);
      scroller.removeEventListener("pointercancel", onUp);
      scroller.removeEventListener("click", onClickCapture, true);
      scroller.removeEventListener("wheel", onWheel);
    },
  };
}

/**
 * Wrap a scroller with prev/next chevrons and bind interactions.
 * @param {HTMLElement} scroller
 * @param {{ label?: string }} [options]
 */
export function enhanceHorizontalScroller(scroller, options = {}) {
  const label = options.label || "Carousel";
  const rail = document.createElement("div");
  rail.className = "h-scroll-rail";

  const prev = document.createElement("button");
  prev.type = "button";
  prev.className = "h-scroll-nav h-scroll-nav--prev";
  prev.setAttribute("aria-label", `${label}: previous`);
  prev.textContent = "‹";

  const next = document.createElement("button");
  next.type = "button";
  next.className = "h-scroll-nav h-scroll-nav--next";
  next.setAttribute("aria-label", `${label}: next`);
  next.textContent = "›";

  const parent = scroller.parentNode;
  parent?.insertBefore(rail, scroller);
  rail.append(prev, scroller, next);

  scroller.setAttribute("role", "region");
  scroller.setAttribute("aria-label", label);
  scroller.tabIndex = 0;

  const controls = bindHorizontalScroller(scroller);

  const syncNav = () => {
    const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const x = scroller.scrollLeft;
    const active = max > 1;
    rail.classList.toggle("h-scroll-rail--scrollable", active);
    prev.disabled = !active || x <= 1;
    next.disabled = !active || x >= max - 1;
  };

  prev.addEventListener("click", () => controls.stepBy(-1));
  next.addEventListener("click", () => controls.stepBy(1));
  scroller.addEventListener("scroll", syncNav, { passive: true });

  const ro =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(syncNav)
      : null;
  ro?.observe(scroller);
  requestAnimationFrame(syncNav);

  return {
    rail,
    destroy() {
      controls.destroy();
      scroller.removeEventListener("scroll", syncNav);
      ro?.disconnect();
      parent?.insertBefore(scroller, rail);
      rail.remove();
    },
  };
}
