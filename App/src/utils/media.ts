/**
 * Demo images under `public/images/`.
 * Prefer explicit maps for files produced by the image agent; fall back to
 * conventional paths so future drops still work.
 */

const communityMap: Record<string, string> = {
  "sri-songkhram": "/images/community-sri-songkhram-indigo.png",
  "chiang-khan": "/images/listing-catch-fish.png",
  "nan-orchard": "/images/listing-coffee-cocoa.png",
  "phayao-lake": "/images/community-laos-river.png",
  "luang-prabang": "/images/community-laos-river.png",
  sapa: "/images/community-vietnam-terraces.png",
  "shan-hills": "/images/community-shan-hills.png",
  "island-coast": "/images/community-island-coast.png",
  "african-village": "/images/community-african-village.png",
};

const listingMap: Record<string, string> = {
  "stay-river-house": "/images/listing-homestay-river.png",
  "exp-indigo": "/images/listing-indigo-workshop.png",
  "prod-indigo-scarf": "/images/listing-indigo-scarf.png",
  "exp-cooking-laos": "/images/listing-laos-cooking.png",
  "stay-sapa": "/images/listing-sapa-homestay.png",
  "exp-field-psych": "/images/listing-wellness-circle.png",
  "exp-peer-circle": "/images/listing-wellness-circle.png",
  "exp-coffee-cocoa": "/images/listing-coffee-cocoa.png",
  "exp-fruit-pick": "/images/listing-coffee-cocoa.png",
  "exp-catch-fish": "/images/listing-catch-fish.png",
  "exp-cook-own": "/images/listing-laos-cooking.png",
  "exp-live-music": "/images/listing-live-music.png",
  "exp-kids-nature": "/images/community-sri-songkhram-indigo.png",
  "exp-elder-stories": "/images/host-community-welcome.png",
  "exp-bamboo-craft": "/images/listing-indigo-workshop.png",
  "exp-herbal-tea": "/images/community-laos-river.png",
  "exp-stargazing": "/images/listing-coffee-cocoa.png",
  "exp-river-picnic": "/images/listing-catch-fish.png",
  "exp-soft-yoga": "/images/listing-wellness-circle.png",
  "exp-board-games": "/images/host-community-welcome.png",
  "exp-rice-harvest": "/images/community-vietnam-terraces.png",
  "exp-pottery": "/images/listing-indigo-workshop.png",
  "exp-kids-weave": "/images/listing-indigo-scarf.png",
  "exp-sunset-boat": "/images/listing-catch-fish.png",
  "exp-birdwatching": "/images/community-laos-river.png",
  "exp-journal-retreat": "/images/listing-wellness-circle.png",
  "exp-laughter-yoga": "/images/listing-wellness-circle.png",
  "exp-community-dinner": "/images/listing-live-music.png",
  "stay-orchard-hut": "/images/listing-coffee-cocoa.png",
  "stay-mekong-porch": "/images/listing-homestay-river.png",
  "prod-herbal-blend": "/images/community-laos-river.png",
  "prod-bamboo-toy": "/images/listing-indigo-scarf.png",
  "prod-garden-cocoa": "/images/listing-coffee-cocoa.png",
  "exp-island-net": "/images/community-island-coast.png",
  "exp-shan-weave": "/images/community-shan-hills.png",
  "exp-savanna-market": "/images/community-african-village.png",
};

const hostMap: Record<string, string> = {
  "host-mae-wan": "/images/host-community-welcome.png",
  "host-boun": "/images/listing-laos-cooking.png",
  "host-dr-nim": "/images/listing-wellness-circle.png",
  "host-lung-chai": "/images/listing-catch-fish.png",
  "host-mae-dao": "/images/listing-coffee-cocoa.png",
  "host-kru-pla": "/images/community-sri-songkhram-indigo.png",
  "host-aoy": "/images/listing-live-music.png",
  "host-som": "/images/community-laos-river.png",
  "host-lin": "/images/listing-sapa-homestay.png",
};

export function communityImageSrc(communityId: string): string {
  return communityMap[communityId] ?? `/images/communities/${communityId}.jpg`;
}

export function listingImageSrc(listingId: string): string {
  return listingMap[listingId] ?? `/images/listings/${listingId}.jpg`;
}

export function hostImageSrc(hostId: string): string {
  return hostMap[hostId] ?? `/images/hosts/${hostId}.jpg`;
}

export function chainImageSrc(productId: string, productImage?: string): string {
  if (productImage) {
    return productImage.startsWith("/") ? productImage : `/${productImage}`;
  }
  return `/images/chain-${productId}.png`;
}

export function chainVideoSrc(productId: string): string {
  return `/videos/chain-${productId}.mp4`;
}

export const heroSplashImage = "/images/hero-riverside-welcome.png";

/** Pitch motif strip — brand atmosphere + craft + welcome */
export const pitchMotifImages = [
  "/images/community-sri-songkhram-indigo.png",
  "/images/listing-indigo-workshop.png",
  "/images/listing-wellness-circle.png",
  "/images/host-community-welcome.png",
] as const;

export const hostHeroImage = "/images/host-community-welcome.png";
