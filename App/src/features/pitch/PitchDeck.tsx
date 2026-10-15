import type { ReactNode } from "react";
import { HorizontalPager } from "../../components/HorizontalPager";
import { Badge } from "../../components/Badge";
import { useAppState } from "../../state/AppState";
import { heroSplashImage, pitchMotifImages } from "../../utils/media";
import "./PitchDeck.css";

function MotifStrip() {
  return (
    <div className="pitch-motif" aria-hidden="true">
      {pitchMotifImages.map((src) => (
        <div key={src} className="pitch-motif__tile pitch-motif__tile--photo">
          <img src={src} alt="" className="demo-media__img" loading="lazy" />
        </div>
      ))}
    </div>
  );
}

function SlideShell({
  eyebrow,
  title,
  children,
  brandHero,
  accent,
  titleAsAsk,
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  brandHero?: boolean;
  accent?: boolean;
  titleAsAsk?: boolean;
}) {
  return (
    <div
      className={`pitch-slide ${brandHero ? "pitch-slide--hero" : ""} ${accent ? "pitch-slide--accent" : ""}`}
    >
      {brandHero ? (
        <div className="pitch-hero-photo" aria-hidden="true">
          <img src={heroSplashImage} alt="" className="pitch-hero-photo__img" />
        </div>
      ) : null}
      <div className="pitch-slide__inner">
        <div className="pitch-slide__frame">
          {brandHero ? (
            <img
              className="brand-logo brand-logo--pitch"
              src="/images/logo-campong.png"
              alt="Campong Innovation"
            />
          ) : null}
          {eyebrow ? <p className="pitch-eyebrow">{eyebrow}</p> : null}
          <h1
            className={
              brandHero ? "pitch-brand" : titleAsAsk ? "pitch-ask" : undefined
            }
          >
            {title}
          </h1>
          <div className="pitch-body">{children}</div>
        </div>
      </div>
      <div className="pitch-hint muted">← → swipe / arrows</div>
    </div>
  );
}

export function PitchDeck() {
  const { setMode, setLane, setGuestScreen } = useAppState();

  const enterDemo = () => {
    setLane("guest");
    setGuestScreen("splash");
    setMode("demo");
  };

  const slides = [
    <SlideShell key="1" brandHero title="BAANYARD" eyebrow="บ้านญาติ">
      <p className="pitch-tagline">
        Stay with rural hosts like visiting relatives — authentic stays, goods & stories from rural
        communities worldwide.
      </p>
      <p className="muted">ไปเยี่ยมญาติชนบท · ที่พัก สินค้า และเรื่องราวจริงจากชุมชนทั่วโลก</p>
      <MotifStrip />
    </SlideShell>,

    <SlideShell key="2" eyebrow="Problem" title="Two gaps, one longing">
      <ul>
        <li>City guests seek warmth, safe food stories, and real belonging.</li>
        <li>Rural communities hold hidden assets — crafts, stays, wisdom — but lack digital reach.</li>
        <li>Global travelers want authenticity without leaving trust, language, or payment behind.</li>
      </ul>
    </SlideShell>,

    <SlideShell key="3" eyebrow="Solution" title="A countryside “third place”" accent>
      <ul>
        <li>
          <strong>Stay & experience</strong> — relatives-style hospitality
        </li>
        <li>
          <strong>Barn marketplace</strong> — homemade goods from the village
        </li>
        <li>
          <strong>Trust tools</strong> — translation, currency, storytelling, video, in-app pay
        </li>
      </ul>
      <MotifStrip />
    </SlideShell>,

    <SlideShell key="4" eyebrow="Why now" title="Connection is the product">
      <p>
        Wellness travel and community tourism are rising while many safe, culture-rich rural regions
        remain under-served by tech that fits low-tech hosts and high-tech guests alike.
      </p>
      <MotifStrip />
    </SlideShell>,

    <SlideShell key="5" eyebrow="Market" title="Thailand seed → global rural network" accent>
      <p>
        MVP narrative starts in <strong>Thailand</strong> (Sri Songkhram) and expands to rural
        Laos, Vietnam, Shan hills, islands, and beyond — wherever culture is rich and digital access
        is uneven.
      </p>
      <Badge kind="estimate" label="Directional · Estimate framing" />
    </SlideShell>,

    <SlideShell key="6" eyebrow="Product" title="One app: pitch meets living demo">
      <p>
        Guest book/buy · Host list in 3 steps · Admin for Country Thailand with branch & HQ sync —
        all in a Simulated demo after this deck.
      </p>
      <div className="pitch-cta-row">
        <button type="button" className="btn" onClick={enterDemo}>
          Peek demo now
        </button>
      </div>
    </SlideShell>,

    <SlideShell key="7" eyebrow="Traction" title="Plan figures only">
      <p className="muted">No measured traction claimed in this build.</p>
      <ul>
        <li>
          Year-3 GMV plan example: 50M THB <Badge kind="estimate" label="Estimate" />
        </li>
        <li>
          Active users plan ladder: 5k → 25k → 100k <Badge kind="estimate" label="Estimate" />
        </li>
      </ul>
      <p>What you can click today is product readiness — labeled Simulated / Demo.</p>
    </SlideShell>,

    <SlideShell key="8" eyebrow="Business model" title="Community-powered take rate" accent>
      <ul>
        <li>
          GP ~20% on goods & services <Badge kind="estimate" label="Estimate from plan" />
        </li>
        <li>Brand / lifestyle advertising</li>
        <li>Managed services (logistics, branding) for communities</li>
        <li>
          Premium forward-purchase: guests fund a small village chain (grow → process → pack → shop)
          and see an illustrative cost/profit split — Simulated, not a securities offering
        </li>
      </ul>
    </SlideShell>,

    <SlideShell key="9" eyebrow="Go-to-market" title="Community-first">
      <ul>
        <li>Seed story: Sri Songkhram indigo & homestays</li>
        <li>Content + ambassadors + private community groups</li>
        <li>Auto-first UX so low-tech hosts are not left behind</li>
      </ul>
      <MotifStrip />
    </SlideShell>,

    <SlideShell key="10" eyebrow="Competition" title="Not another generic OTA">
      <p>
        Generic OTAs and marketplaces optimize scale listings. BAANYARD optimizes{" "}
        <strong>relatives-in-the-countryside authenticity</strong>, homemade goods, and tools that
        close the digital inequality gap without erasing culture.
      </p>
    </SlideShell>,

    <SlideShell key="11" eyebrow="Team + Ask" title="1,500,000 THB" titleAsAsk accent>
      <p>
        Use of funds <Badge kind="estimate" label="Estimate from plan" />
      </p>
      <ul>
        <li>MVP platform — 800,000</li>
        <li>Community marketing — 300,000</li>
        <li>Operations & working capital — 400,000</li>
      </ul>
    </SlideShell>,

    <SlideShell key="12" eyebrow="Trust & Compliance" title="Designed for trust">
      <p>Roadmap toward — not certified:</p>
      <ul>
        <li>PDPA · GDPR · Privacy by Design & Default</li>
        <li>ISO 27001 · ISO 27701 (privacy) · SOC 2</li>
      </ul>
      <p className="muted">No certification badges are claimed in this demo.</p>
    </SlideShell>,

    <SlideShell key="13" eyebrow="Next" title="Try the living product" accent>
      <p>Explore Guest, Host, and Thailand Country Admin — all Simulated.</p>
      <MotifStrip />
      <div className="pitch-cta-row">
        <button type="button" className="btn" onClick={enterDemo}>
          Enter product demo
        </button>
      </div>
    </SlideShell>,
  ];

  return (
    <div className="pitch-root">
      <HorizontalPager>{slides}</HorizontalPager>
    </div>
  );
}
