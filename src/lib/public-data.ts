import "server-only";
import { unstable_cache } from "next/cache";
import type { Product } from "@/data/products";
import {
  fetchSedifexCatalog,
  fetchSedifexPromo,
  fetchSedifexPromoGallery,
  fetchSedifexTopSelling,
  type SedifexPromoGalleryItem,
  type SedifexPromoProfile,
  type SedifexTopSellingProduct
} from "@/lib/sedifex";

const STORE_CACHE_KEY = process.env.SEDIFEX_STORE_ID || "hajiashop";
const PUBLIC_DATA_REVALIDATE_SECONDS = 900;

const loadCatalog = unstable_cache(
  async (): Promise<Product[]> => fetchSedifexCatalog(),
  ["hajiashop-catalog-v1", STORE_CACHE_KEY],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: ["hajiashop-catalog"]
  }
);

const loadPromo = unstable_cache(
  async (): Promise<SedifexPromoProfile | null> => fetchSedifexPromo(),
  ["hajiashop-promo-v1", STORE_CACHE_KEY],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: ["hajiashop-promo"]
  }
);

const loadPromoGallery = unstable_cache(
  async (): Promise<SedifexPromoGalleryItem[]> => fetchSedifexPromoGallery(),
  ["hajiashop-gallery-v1", STORE_CACHE_KEY],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: ["hajiashop-gallery"]
  }
);

const loadTopSelling = unstable_cache(
  async (): Promise<SedifexTopSellingProduct[]> => fetchSedifexTopSelling(30, 10),
  ["hajiashop-top-selling-30-days-v1", STORE_CACHE_KEY],
  {
    revalidate: PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: ["hajiashop-top-selling"]
  }
);

export function getCachedSedifexCatalog() {
  return loadCatalog();
}

export function getCachedSedifexPromo() {
  return loadPromo();
}

export function getCachedSedifexPromoGallery() {
  return loadPromoGallery();
}

export function getCachedSedifexTopSelling() {
  return loadTopSelling();
}
