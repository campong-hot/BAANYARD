/** Shared helpers — no framework */

/** True when the page can use getUserMedia / other secure APIs (HTTPS or localhost). */
export function isSecureContext() {
  return typeof window !== "undefined" && window.isSecureContext === true;
}

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "className") node.className = v;
    else if (k === "dataset") Object.assign(node.dataset, v);
    else if (k === "style" && typeof v === "object") Object.assign(node.style, v);
    else if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === "html") node.innerHTML = v;
    else if (k === "text") node.textContent = v;
    else if (
      k === "checked" ||
      k === "selected" ||
      k === "disabled" ||
      k === "value" ||
      k === "muted" ||
      k === "autoplay" ||
      k === "playsInline" ||
      k === "controls"
    ) {
      node[k] = v;
    } else node.setAttribute(k, v === true ? "" : String(v));
  }
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

export function badge(label, kind = "simulated") {
  return el("span", { className: kind === "estimate" ? "chip chip-sage" : "chip", text: label });
}

let lazyVideoObserver;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function observeLazyVideo(video) {
  const loadAndPlay = () => {
    if (!video.getAttribute("src") && video.dataset.src) {
      video.src = video.dataset.src;
    }
    video.muted = true;
    video.play().catch(() => {});
  };
  if (!("IntersectionObserver" in window)) {
    loadAndPlay();
    return;
  }
  if (!lazyVideoObserver) {
    lazyVideoObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const node = entry.target;
          if (!(node instanceof HTMLVideoElement)) continue;
          if (entry.isIntersecting) {
            if (!node.getAttribute("src") && node.dataset.src) node.src = node.dataset.src;
            node.muted = true;
            node.play().catch(() => {});
          } else {
            node.pause();
          }
        }
      },
      { rootMargin: "96px 0px", threshold: 0.12 },
    );
  }
  lazyVideoObserver.observe(video);
}

export function demoMedia(src, className = "", extra = {}) {
  const wrap = el("div", { className, style: extra.style || null, "data-kind": extra["data-kind"] || null });
  const img = el("img", {
    src,
    alt: extra.alt || "",
    className: "demo-media__img",
    loading: "lazy",
  });
  img.addEventListener("error", () => {
    img.remove();
  });
  wrap.append(img);

  const videoSrc = extra.video;
  if (videoSrc && !prefersReducedMotion()) {
    const video = el("video", {
      className: "demo-media__img demo-media__video",
      poster: src,
      muted: true,
      loop: true,
      playsInline: true,
      autoplay: Boolean(extra.eager),
      preload: extra.eager ? "metadata" : "none",
      "aria-hidden": "true",
    });
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.controls = false;
    video.disablePictureInPicture = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("disablepictureinpicture", "");
    video.setAttribute("controlslist", "nodownload nofullscreen noremoteplayback");
    video.addEventListener("error", () => {
      video.remove();
    });
    if (extra.eager) {
      video.src = videoSrc;
      video.addEventListener("canplay", () => {
        video.muted = true;
        video.play().catch(() => {});
      });
    } else {
      video.dataset.src = videoSrc;
      observeLazyVideo(video);
    }
    wrap.append(video);
  }
  return wrap;
}

export function formatMoney(amountThb, currency, lang, rates) {
  const value = amountThb * (rates[currency] ?? 1);
  const locale = lang === "th" ? "th-TH" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "THB" || currency === "LAK" || currency === "VND" ? 0 : 2,
  }).format(value);
}

export function demoTranslate(text, from, to) {
  if (from === to) return text;
  if (to === "th") return `[แปลอัตโนมัติ TH] ${text}`;
  return `[Auto-translated EN] ${text}`;
}

export function communityImage(media, id) {
  return media.communities[id] || `images/communities/${id}.jpg`;
}

export function listingImage(media, id) {
  return media.listings[id] || `images/listings/${id}.jpg`;
}

export function chainImage(media, id) {
  return media.chains?.[id] || `images/chain-${id}.png`;
}

export function chainVideo(media, id) {
  return media.chainVideos?.[id] || `videos/chain-${id}.mp4`;
}

export function hostImage(media, id) {
  return media.hosts[id] || `images/hosts/${id}.jpg`;
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}
