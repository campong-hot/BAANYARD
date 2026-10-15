import { Badge } from "../components/Badge";
import { DemoMedia } from "../components/DemoMedia";
import { HorizontalScroller } from "../components/HorizontalScroller";
import type { DictKey } from "../i18n";
import { t } from "../i18n";
import { useAppState } from "../state/AppState";
import { formatMoney } from "../utils/currency";
import { chainImageSrc, chainVideoSrc } from "../utils/media";
import {
  findChainRow,
  flattenChainProducts,
  supplyChains,
  type ChainProduct,
  type ChainProvince,
  type ChainRole,
  type ChainStatus,
} from "../data/supplyChains";

const ROLE_KEYS: Record<ChainRole, DictKey> = {
  grower: "chainRoleGrower",
  processor: "chainRoleProcessor",
  packager: "chainRolePackager",
  investor: "chainRoleInvestor",
  retail: "chainRoleRetail",
};

function statusKey(status: ChainStatus): DictKey {
  return `chainStatus_${status}` as DictKey;
}

function productName(product: ChainProduct, lang: "th" | "en") {
  return lang === "th" ? product.nameTh : product.name;
}

function provinceTitle(province: ChainProvince, lang: "th" | "en") {
  const main = lang === "th" ? province.nameTh : province.name;
  const local = lang === "th" ? province.localNameTh : province.localName;
  return local ? `${main} · ${local}` : main;
}

function effectiveStatus(product: ChainProduct, overrides: Record<string, ChainStatus>) {
  return overrides[product.id] || product.status;
}

export function ChainExploreSection() {
  const { uiLang, currency, exploreFilter, openChain, chainStatus } = useAppState();
  const rows = flattenChainProducts();
  const chainOnly = exploreFilter === "chain";

  return (
    <section className="guest-section chain-explore">
      <div className="row-between chain-section-head">
        <h2>{t(uiLang, "chainSection")}</h2>
        <Badge label={t(uiLang, "simulated")} />
      </div>
      <p className="muted">{t(uiLang, "chainExploreSub")}</p>
      <p className="muted tiny">{uiLang === "th" ? supplyChains.disclaimerTh : supplyChains.disclaimerEn}</p>
      {chainOnly
        ? supplyChains.provinces.map((province) => (
            <div key={province.id} className="chain-province">
              <h3>{provinceTitle(province, uiLang)}</h3>
              <HorizontalScroller label={t(uiLang, "chainSection")} className="h-scroll--listings">
                {province.products.map((product) => (
                  <ChainCard
                    key={product.id}
                    province={province}
                    product={product}
                    status={effectiveStatus(product, chainStatus)}
                    onOpen={openChain}
                    lang={uiLang}
                    currency={currency}
                  />
                ))}
              </HorizontalScroller>
            </div>
          ))
        : (
            <HorizontalScroller label={t(uiLang, "chainSection")} className="h-scroll--listings">
              {rows.map(({ province, product }) => (
                <ChainCard
                  key={product.id}
                  province={province}
                  product={product}
                  status={effectiveStatus(product, chainStatus)}
                  onOpen={openChain}
                  lang={uiLang}
                  currency={currency}
                />
              ))}
            </HorizontalScroller>
          )}
    </section>
  );
}

function ChainCard({
  province,
  product,
  status,
  onOpen,
  lang,
  currency,
}: {
  province: ChainProvince;
  product: ChainProduct;
  status: ChainStatus;
  onOpen: (id: string) => void;
  lang: "th" | "en";
  currency: "THB" | "USD" | "EUR" | "LAK" | "VND";
}) {
  const crop = lang === "th" ? product.cropTh : product.crop;
  return (
    <button type="button" className="listing-card chain-card" onClick={() => onOpen(product.id)}>
      <DemoMedia
        src={chainImageSrc(product.id, product.image)}
        videoSrc={chainVideoSrc(product.id)}
        className="chain-card__media listing-card__media"
        alt={crop}
      >
        <span className="chain-card__crop">{crop}</span>
      </DemoMedia>
      <div className="listing-card__body">
        <Badge label={t(lang, "simulated")} />
        <span className="chip chip-sage">{t(lang, statusKey(status))}</span>
        <strong>{productName(product, lang)}</strong>
        <span className="muted">{provinceTitle(province, lang)}</span>
        <span className="muted">{formatMoney(product.preOrderAmount, currency, lang)}</span>
      </div>
    </button>
  );
}

export function ChainDetailScreen() {
  const {
    uiLang,
    currency,
    selectedChainId,
    setGuestScreen,
    chainStatus,
    chainBookings,
  } = useAppState();
  const row = selectedChainId ? findChainRow(selectedChainId) : null;
  if (!row) return null;
  const { province, product } = row;
  const status = effectiveStatus(product, chainStatus);
  const booked = Boolean(chainBookings[product.id]);

  return (
    <div className="guest-panel fade-in chain-detail">
      <button type="button" className="btn btn-ghost" onClick={() => setGuestScreen("explore")}>
        ← {t(uiLang, "back")}
      </button>
      <Badge label={t(uiLang, "simulated")} />
      <DemoMedia
        src={chainImageSrc(product.id, product.image)}
        videoSrc={chainVideoSrc(product.id)}
        eager
        className="listing-hero-media chain-detail__hero"
        alt={uiLang === "th" ? product.cropTh : product.crop}
      />
      <p className="chip">{provinceTitle(province, uiLang)}</p>
      <h1>{productName(product, uiLang)}</h1>
      <p className="muted">{uiLang === "th" ? product.cropTh : product.crop}</p>
      <p className="chip chip-sage">{t(uiLang, statusKey(status))}</p>
      <p className="listing-desc">{uiLang === "th" ? product.storyTh : product.story}</p>
      <p className="price">{formatMoney(product.preOrderAmount, currency, uiLang)}</p>
      <section className="card chain-flow-card">
        <h2>{t(uiLang, "chainFlowTitle")}</h2>
        <ol className="chain-flow h-scroll">
          {product.nodes.map((node) => (
            <li key={node.role + node.name} className="chain-flow__step">
              <span className="chain-flow__role">{t(uiLang, ROLE_KEYS[node.role])}</span>
              <strong>{uiLang === "th" ? node.nameTh : node.name}</strong>
            </li>
          ))}
        </ol>
      </section>
      <section className="card">
        <h2>{t(uiLang, "chainCalendar")}</h2>
        <ol className="chain-cal">
          {product.timeline.map((slot) => (
            <li key={slot.id}>
              <strong>{uiLang === "th" ? slot.labelTh : slot.label}</strong>
              <span className="muted">{slot.date}</span>
            </li>
          ))}
        </ol>
      </section>
      <section className="card">
        <h3>{t(uiLang, "chainProfitSplit")}</h3>
        <ul className="chain-split__bars">
          {(
            [
              ["farmerShare", "chainRoleGrower"],
              ["processorShare", "chainRoleProcessor"],
              ["packagerShare", "chainRolePackager"],
              ["investorShare", "chainRoleInvestor"],
            ] as const
          ).map(([field, key]) => (
            <li key={field}>
              <span>
                {t(uiLang, key)} {product[field]}%
              </span>
              <span className="chain-split__bar" style={{ width: `${product[field]}%` }} aria-hidden="true" />
            </li>
          ))}
        </ul>
        <p className="muted tiny">{t(uiLang, "chainSplitNote")}</p>
      </section>
      <p className="muted tiny">{uiLang === "th" ? supplyChains.disclaimerTh : supplyChains.disclaimerEn}</p>
      <div className="cta-row">
        <button
          type="button"
          className="btn"
          disabled={booked || status === "settled"}
          onClick={() => setGuestScreen("chainConfirm")}
        >
          {booked ? t(uiLang, "chainBooked") : t(uiLang, "chainCta")}
        </button>
      </div>
    </div>
  );
}

export function ChainConfirmScreen() {
  const { uiLang, currency, selectedChainId, setGuestScreen, bookChain } = useAppState();
  const row = selectedChainId ? findChainRow(selectedChainId) : null;
  if (!row) return null;
  const { product } = row;
  return (
    <div className="guest-panel fade-in">
      <button type="button" className="btn btn-ghost" onClick={() => setGuestScreen("chain")}>
        ← {t(uiLang, "back")}
      </button>
      <Badge label={t(uiLang, "simulated")} />
      <h1>{t(uiLang, "chainConfirmTitle")}</h1>
      <p>{productName(product, uiLang)}</p>
      <p className="price">{formatMoney(product.preOrderAmount, currency, uiLang)}</p>
      <p className="muted">{t(uiLang, "chainConfirmBody")}</p>
      <p className="muted tiny">{uiLang === "th" ? supplyChains.disclaimerTh : supplyChains.disclaimerEn}</p>
      <button
        type="button"
        className="btn"
        onClick={() => {
          bookChain(product.id);
          setGuestScreen("chainSuccess");
        }}
      >
        {t(uiLang, "chainConfirmCta")}
      </button>
    </div>
  );
}

export function ChainSuccessScreen() {
  const { uiLang, selectedChainId, setGuestScreen } = useAppState();
  const row = selectedChainId ? findChainRow(selectedChainId) : null;
  return (
    <div className="guest-panel success-pop">
      <Badge label={t(uiLang, "simulated")} />
      <h1>{t(uiLang, "chainSuccessTitle")}</h1>
      <p>{t(uiLang, "chainSuccessBody")}</p>
      {row ? (
        <ol className="chain-cal">
          {row.product.timeline.map((slot) => (
            <li key={slot.id}>
              <strong>{uiLang === "th" ? slot.labelTh : slot.label}</strong>
              <span className="muted">{slot.date}</span>
            </li>
          ))}
        </ol>
      ) : null}
      <p className="muted tiny">{uiLang === "th" ? supplyChains.disclaimerTh : supplyChains.disclaimerEn}</p>
      <button type="button" className="btn" onClick={() => setGuestScreen("explore")}>
        {t(uiLang, "continueExplore")}
      </button>
    </div>
  );
}

export function HostChainPanel() {
  const { uiLang, chainStatus } = useAppState();
  const rows = flattenChainProducts();
  return (
    <section className="card host-list chain-host">
      <div className="row-between">
        <h2>{t(uiLang, "chainHostTitle")}</h2>
        <Badge label={t(uiLang, "simulated")} />
      </div>
      <p className="muted">{t(uiLang, "chainHostHint")}</p>
      <ul className="chain-admin-list">
        {rows.map(({ province, product }) => (
          <li key={product.id}>
            <strong>{productName(product, uiLang)}</strong>
            <span className="muted">
              {" "}
              · {provinceTitle(province, uiLang)} · {t(uiLang, statusKey(effectiveStatus(product, chainStatus)))}
            </span>
          </li>
        ))}
      </ul>
      <p className="muted tiny">{uiLang === "th" ? supplyChains.disclaimerTh : supplyChains.disclaimerEn}</p>
    </section>
  );
}

export function AdminChainPanel() {
  const { uiLang, chainStatus, chainSettleNote, advanceChain } = useAppState();
  const rows = flattenChainProducts();
  return (
    <section className="card admin-block chain-admin">
      <div className="row-between">
        <h2>{t(uiLang, "chainAdminTitle")}</h2>
        <Badge label={t(uiLang, "simulated")} />
      </div>
      <p className="muted">{t(uiLang, "chainAdminHint")}</p>
      <div className="audit-table-wrap">
        <table className="audit-table">
          <thead>
            <tr>
              <th>{t(uiLang, "chainColProduct")}</th>
              <th>{t(uiLang, "chainColProvince")}</th>
              <th>{t(uiLang, "chainColStatus")}</th>
              <th>{t(uiLang, "chainColAction")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ province, product }) => {
              const status = effectiveStatus(product, chainStatus);
              return (
                <tr key={product.id}>
                  <td>{productName(product, uiLang)}</td>
                  <td>{uiLang === "th" ? province.nameTh : province.name}</td>
                  <td>{t(uiLang, statusKey(status))}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-secondary chain-sync-btn"
                      disabled={status === "settled"}
                      onClick={() => advanceChain(product.id, product.status)}
                    >
                      {t(uiLang, "chainSettleSync")}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="muted tiny">
        {t(uiLang, "chainSettleNote")} · {chainSettleNote || t(uiLang, "chainSettleIdle")}
      </p>
      <p className="muted tiny">{uiLang === "th" ? supplyChains.disclaimerTh : supplyChains.disclaimerEn}</p>
    </section>
  );
}
