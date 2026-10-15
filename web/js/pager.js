/**
 * Reliable left/right paging for .h-pager while keeping vertical scroll on pages.
 * Native overflow-x alone fights nested overflow-y / touch-action ancestors on mobile.
 */

const INTERACTIVE = "button, a, input, select, textarea, label, [role='button']";

export function bindHorizontalPager(pager, options = {}) {
  const getCount = () =>
    options.count != null ? options.count : pager.children.length;

  const getWidth = () => pager.clientWidth || 1;

  const currentIndex = () => Math.round(pager.scrollLeft / getWidth());

  const goTo = (index, behavior = "smooth") => {
    const max = Math.max(0, getCount() - 1);
    const i = Math.max(0, Math.min(max, index));
    pager.scrollTo({ left: getWidth() * i, behavior });
    options.onIndex?.(i);
    return i;
  };

  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let startScroll = 0;
  let axis = null; // null | "x" | "y"

  const reset = () => {
    pointerId = null;
    axis = null;
    pager.classList.remove("h-pager--dragging");
  };

  const onDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return;
    pointerId = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    startScroll = pager.scrollLeft;
    axis = null;
  };

  const onMove = (e) => {
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

  const onUp = (e) => {
    if (pointerId !== e.pointerId) return;
    const dx = e.clientX - startX;
    const width = getWidth();
    const startIndex = Math.round(startScroll / width);
    const wasX = axis === "x";
    reset();
    if (!wasX) return;

    const threshold = Math.min(56, width * 0.18);
    if (dx <= -threshold) goTo(startIndex + 1);
    else if (dx >= threshold) goTo(startIndex - 1);
    else goTo(startIndex);
  };

  const onKey = (e) => {
    const index = currentIndex();
    if (e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  pager.addEventListener("pointerdown", onDown);
  pager.addEventListener("pointermove", onMove, { passive: false });
  pager.addEventListener("pointerup", onUp);
  pager.addEventListener("pointercancel", onUp);
  window.addEventListener("keydown", onKey);

  return {
    goTo,
    currentIndex,
    destroy() {
      reset();
      pager.removeEventListener("pointerdown", onDown);
      pager.removeEventListener("pointermove", onMove);
      pager.removeEventListener("pointerup", onUp);
      pager.removeEventListener("pointercancel", onUp);
      window.removeEventListener("keydown", onKey);
    },
  };
}
