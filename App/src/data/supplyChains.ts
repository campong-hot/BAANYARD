import raw from "./supply-chains.json";

export type ChainStatus =
  | "open"
  | "funded"
  | "growing"
  | "processing"
  | "packing"
  | "retail"
  | "settled";

export type ChainRole = "grower" | "processor" | "packager" | "investor" | "retail";

export type ChainNode = { role: ChainRole; name: string; nameTh: string };
export type ChainSlot = { id: string; label: string; labelTh: string; date: string };

export type ChainProduct = {
  id: string;
  name: string;
  nameTh: string;
  image?: string;
  crop: string;
  cropTh: string;
  story: string;
  storyTh: string;
  preOrderAmount: number;
  farmerShare: number;
  processorShare: number;
  packagerShare: number;
  investorShare: number;
  status: ChainStatus;
  nodes: ChainNode[];
  timeline: ChainSlot[];
};

export type ChainProvince = {
  id: string;
  name: string;
  nameTh: string;
  localName: string;
  localNameTh: string;
  communityId: string | null;
  products: ChainProduct[];
};

export type SupplyChainsFile = {
  simulated: boolean;
  disclaimerEn: string;
  disclaimerTh: string;
  provinces: ChainProvince[];
};

export const STATUS_FLOW: ChainStatus[] = [
  "open",
  "funded",
  "growing",
  "processing",
  "packing",
  "retail",
  "settled",
];

export const supplyChains = raw as SupplyChainsFile;

export function flattenChainProducts() {
  return supplyChains.provinces.flatMap((province) =>
    province.products.map((product) => ({ province, product })),
  );
}

export function findChainRow(id: string) {
  return flattenChainProducts().find((row) => row.product.id === id) ?? null;
}

export function nextChainStatus(status: ChainStatus): ChainStatus {
  const i = STATUS_FLOW.indexOf(status);
  if (i < 0 || i >= STATUS_FLOW.length - 1) return status;
  return STATUS_FLOW[i + 1];
}
