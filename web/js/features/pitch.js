import { badge, el } from "../utils.js";
import { bindHorizontalPager } from "../pager.js";

function motifStrip(media) {
  return el(
    "div",
    { className: "pitch-motif", "aria-hidden": "true" },
    media.pitchMotifs.map((src) =>
      el("div", { className: "pitch-motif__tile pitch-motif__tile--photo" }, [
        el("img", { src, alt: "", className: "demo-media__img", loading: "lazy" }),
      ]),
    ),
  );
}

function slideShell(slide, media, onEnter) {
  const classes = ["pitch-slide"];
  if (slide.brandHero) classes.push("pitch-slide--hero");
  if (slide.accent) classes.push("pitch-slide--accent");

  const titleClass = slide.brandHero ? "pitch-brand" : slide.titleAsAsk ? "pitch-ask" : undefined;
  const bodyKids = [];

  if (slide.tagline) {
    bodyKids.push(el("p", { className: "pitch-tagline", text: slide.tagline }));
    if (slide.taglineTh) bodyKids.push(el("p", { className: "muted", text: slide.taglineTh }));
  }
  if (slide.body) bodyKids.push(el("p", { text: slide.body }));
  if (slide.bodyHtml) bodyKids.push(el("p", { html: slide.bodyHtml }));
  if (slide.muted) bodyKids.push(el("p", { className: "muted", text: slide.muted }));

  const bullets = slide.bullets || [];
  const htmlBullets = slide.htmlBullets || [];
  if (bullets.length || htmlBullets.length) {
    const ul = el("ul");
    for (const b of bullets) ul.append(el("li", { text: b }));
    for (const b of htmlBullets) ul.append(el("li", { html: b }));
    bodyKids.push(ul);
  }

  if (slide.badgeEstimate) {
    bodyKids.push(badge("Directional · Estimate framing", "estimate"));
  }
  if (slide.motif) bodyKids.push(motifStrip(media));
  if (slide.footer) bodyKids.push(el("p", { text: slide.footer }));
  if (slide.cta) {
    bodyKids.push(
      el("div", { className: "pitch-cta-row" }, [
        el("button", { type: "button", className: "btn", text: slide.cta, onClick: onEnter }),
      ]),
    );
  }

  const frame = el("div", { className: "pitch-slide__frame" }, [
    slide.brandHero
      ? el("img", {
          className: "brand-logo brand-logo--pitch",
          src: "images/logo-campong.png?v=20260916a",
          alt: "Campong Innovation",
        })
      : null,
    slide.eyebrow ? el("p", { className: "pitch-eyebrow", text: slide.eyebrow }) : null,
    el("h1", { className: titleClass, text: slide.title }),
    el("div", { className: "pitch-body" }, bodyKids),
  ]);

  return el("div", { className: classes.join(" ") }, [
    slide.brandHero
      ? el("div", { className: "pitch-hero-photo", "aria-hidden": "true" }, [
          el("img", { src: media.heroSplash, alt: "", className: "pitch-hero-photo__img" }),
        ])
      : null,
    el("div", { className: "pitch-slide__inner" }, [frame]),
    el("div", { className: "pitch-hint muted", text: "← → swipe / arrows" }),
  ]);
}

export function renderPitch(root, ctx) {
  const { data, api } = ctx;
  const pager = el("div", { className: "h-pager", role: "region", "aria-label": "Pitch slides" });
  const slides = data.pitch.slides.map((slide) =>
    el("section", { className: "h-pager__page" }, [
      slideShell(slide, data.media, () => api.enterDemo()),
    ]),
  );
  for (const s of slides) pager.append(s);

  const controls = bindHorizontalPager(pager, { count: slides.length });
  root._pitchPagerCleanup = () => controls.destroy();

  root.append(el("div", { className: "pitch-root" }, [pager]));
}

export function cleanupPitch(root) {
  if (root._pitchPagerCleanup) {
    root._pitchPagerCleanup();
    root._pitchPagerCleanup = null;
  }
}
