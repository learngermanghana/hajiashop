import type { Product } from "@/data/products";

type SedifexRecord = Record<string, unknown>;

type SedifexPromotion = {
  productId?: string;
  sku?: string;
  promoPrice?: number;
  startsAt?: string;
  endsAt?: string;
  isActive?: boolean;
};

export type SedifexPromoProfile = {
  promoTitle?: string;
  promoSummary?: string;
  promoStartDate?: string;
  promoEndDate?: string;
  promoSlug?: string;
  promoWebsiteUrl?: string;
  displayName?: string;
  name?: string;
};

export type SedifexPromoGalleryItem = {
  url: string;
  alt?: string;
  caption?: string;
  sortOrder?: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const DEFAULT_TIMEOUT_MS = 10_000;

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function toBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value.toLowerCase() === "true") {
      return true;
    }

    if (value.toLowerCase() === "false") {
      return false;
    }
  }

  return fallback;
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const revalidateSeconds = toNumber(process.env.SEDIFEX_REVALIDATE_SECONDS) ?? 60;

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      next: {
        revalidate: revalidateSeconds
      }
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchSedifexResource(path: string) {
  const baseUrl = process.env.SEDIFEX_BASE_URL;
  const apiKey = process.env.SEDIFEX_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("Sedifex is not configured. Missing SEDIFEX_BASE_URL or SEDIFEX_API_KEY.");
  }

  const timeoutMs = toNumber(process.env.SEDIFEX_TIMEOUT_MS) ?? DEFAULT_TIMEOUT_MS;
  const endpoint = `${normalizeBaseUrl(baseUrl)}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetchWithTimeout(
    endpoint,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "x-api-key": apiKey,
        Accept: "application/json"
      }
    },
    timeoutMs
  );

  if (!response.ok) {
    throw new Error(`Sedifex request failed for ${path} (${response.status})`);
  }

  return response.json();
}

async function fetchSedifexIntegrationResource(path: string) {
  const baseUrl = process.env.SEDIFEX_API_BASE_URL ?? process.env.SEDIFEX_BASE_URL;
  const apiKey = process.env.SEDIFEX_INTEGRATION_KEY ?? process.env.SEDIFEX_API_KEY;
  const storeId = process.env.SEDIFEX_STORE_ID;

  if (!baseUrl || !apiKey || !storeId) {
    throw new Error("Sedifex integration is not configured. Missing SEDIFEX_API_BASE_URL, SEDIFEX_INTEGRATION_KEY, or SEDIFEX_STORE_ID.");
  }

  const timeoutMs = toNumber(process.env.SEDIFEX_TIMEOUT_MS) ?? DEFAULT_TIMEOUT_MS;
  const endpoint = `${normalizeBaseUrl(baseUrl)}${path.startsWith("/") ? path : `/${path}`}?storeId=${encodeURIComponent(storeId)}`;

  const response = await fetchWithTimeout(
    endpoint,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "x-api-key": apiKey,
        Accept: "application/json"
      }
    },
    timeoutMs
  );

  if (!response.ok) {
    throw new Error(`Sedifex integration request failed for ${path} (${response.status})`);
  }

  return response.json();
}

function isPromoActive(promo: SedifexPromotion, now: Date) {
  if (promo.isActive === false) {
    return false;
  }

  const startsAt = promo.startsAt ? new Date(promo.startsAt) : null;
  const endsAt = promo.endsAt ? new Date(promo.endsAt) : null;

  if (startsAt && Number.isNaN(startsAt.getTime())) {
    return false;
  }

  if (endsAt && Number.isNaN(endsAt.getTime())) {
    return false;
  }

  if (startsAt && startsAt > now) {
    return false;
  }

  if (endsAt && endsAt < now) {
    return false;
  }

  return true;
}

function toPromotions(payload: unknown): SedifexPromotion[] {
  if (!payload) {
    return [];
  }

  const records = Array.isArray(payload)
    ? payload
    : typeof payload === "object" && payload !== null && Array.isArray((payload as SedifexRecord).data)
      ? ((payload as SedifexRecord).data as unknown[])
      : [];

  return records.map((promo) => {
    const data = promo as SedifexRecord;

    return {
      productId: (data.product_id as string | undefined) ?? (data.productId as string | undefined),
      sku: data.sku as string | undefined,
      promoPrice: toNumber(data.promo_price ?? data.promoPrice ?? data.discounted_price) ?? undefined,
      startsAt: (data.start_at as string | undefined) ?? (data.startsAt as string | undefined),
      endsAt: (data.end_at as string | undefined) ?? (data.endsAt as string | undefined),
      isActive: toBoolean(data.active ?? data.isActive, true)
    };
  });
}

function toProducts(payload: unknown, promotions: SedifexPromotion[]): Product[] {
  const records = Array.isArray(payload)
    ? payload
    : typeof payload === "object" && payload !== null && Array.isArray((payload as SedifexRecord).data)
      ? ((payload as SedifexRecord).data as unknown[])
      : [];

  const now = new Date();

  return records
    .map((item) => {
      const data = item as SedifexRecord;
      const name = (data.name as string | undefined) ?? (data.title as string | undefined) ?? "Untitled Product";
      const id =
        (data.id as string | undefined) ??
        (data.product_id as string | undefined) ??
        (data.productId as string | undefined) ??
        slugify(name);
      const sku = (data.sku as string | undefined) ?? id;

      const matchingPromo = promotions.find(
        (promo) => (promo.productId && promo.productId === id) || (promo.sku && promo.sku === sku)
      );

      const basePrice = toNumber(data.price ?? data.list_price ?? data.sale_price) ?? 0;
      const promoPrice = matchingPromo?.promoPrice ?? null;
      const usePromo = matchingPromo && promoPrice !== null && promoPrice < basePrice && isPromoActive(matchingPromo, now);

      const imageUrl =
        (data.image as string | undefined) ??
        (data.image_url as string | undefined) ??
        (data.thumbnail as string | undefined) ??
        "/uploads/products/placeholder.png";

      const gallery = Array.isArray(data.gallery)
        ? (data.gallery.filter((entry): entry is string => typeof entry === "string") as string[])
        : imageUrl
          ? [imageUrl]
          : [];

      return {
        id,
        slug: (data.slug as string | undefined) ?? slugify(name),
        name,
        type: (data.type as string | undefined) ?? (data.product_type as string | undefined) ?? "Beauty Product",
        category: (data.category as string | undefined) ?? "General",
        price: usePromo ? (promoPrice as number) : basePrice,
        currency: (data.currency as string | undefined) ?? "GHS",
        image: imageUrl,
        gallery,
        shortDescription:
          (data.short_description as string | undefined) ??
          (data.shortDescription as string | undefined) ??
          "High-quality beauty product from Sedifex catalog.",
        description:
          (data.description as string | undefined) ??
          "Imported automatically from Sedifex for live catalog sync.",
        inStock: toBoolean(data.in_stock ?? data.inStock, true),
        featured: toBoolean(data.featured, false),
        tags: Array.isArray(data.tags) ? (data.tags.filter((entry): entry is string => typeof entry === "string") as string[]) : []
      } satisfies Product;
    })
    .filter((product) => Boolean(product.slug && product.name));
}

function dedupeProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  const unique: Product[] = [];

  for (const product of products) {
    const key = `${product.id}|${product.name}|${product.price}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    unique.push(product);
  }

  return unique;
}

function toPromoProfile(payload: unknown): SedifexPromoProfile | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as SedifexRecord;
  const candidate = (data.promo ?? data.store ?? data.data ?? payload) as SedifexRecord;

  return {
    promoTitle: candidate.promoTitle as string | undefined,
    promoSummary: candidate.promoSummary as string | undefined,
    promoStartDate: candidate.promoStartDate as string | undefined,
    promoEndDate: candidate.promoEndDate as string | undefined,
    promoSlug: candidate.promoSlug as string | undefined,
    promoWebsiteUrl: candidate.promoWebsiteUrl as string | undefined,
    displayName: candidate.displayName as string | undefined,
    name: candidate.name as string | undefined
  };
}

function toPromoGallery(payload: unknown): SedifexPromoGalleryItem[] {
  if (!payload) {
    return [];
  }

  const records = Array.isArray(payload)
    ? payload
    : typeof payload === "object" && payload !== null && Array.isArray((payload as SedifexRecord).items)
      ? ((payload as SedifexRecord).items as unknown[])
      : typeof payload === "object" && payload !== null && Array.isArray((payload as SedifexRecord).data)
        ? ((payload as SedifexRecord).data as unknown[])
        : [];

  return records
    .flatMap((item) => {
      const data = item as SedifexRecord;
      const url = data.url as string | undefined;

      if (!url) {
        return [];
      }

      const normalized: SedifexPromoGalleryItem = {
        url,
        alt: data.alt as string | undefined,
        caption: data.caption as string | undefined,
        sortOrder: toNumber(data.sortOrder) ?? undefined,
        isPublished: toBoolean(data.isPublished, true),
        createdAt: data.createdAt as string | undefined,
        updatedAt: data.updatedAt as string | undefined
      };

      return [normalized];
    })
    .sort((a, b) => (a.sortOrder ?? Number.MAX_SAFE_INTEGER) - (b.sortOrder ?? Number.MAX_SAFE_INTEGER));
}

export async function fetchSedifexCatalog(): Promise<Product[]> {
  const integrationEnabled = Boolean(process.env.SEDIFEX_API_BASE_URL && process.env.SEDIFEX_STORE_ID);

  if (integrationEnabled) {
    const productsPayload = await fetchSedifexIntegrationResource("/integrationProducts");
    const products = Array.isArray((productsPayload as SedifexRecord).products)
      ? ((productsPayload as SedifexRecord).products as unknown[])
      : Array.isArray(productsPayload)
        ? (productsPayload as unknown[])
        : [];

    return dedupeProducts(toProducts(products, []));
  }

  const productsPath = process.env.SEDIFEX_PRODUCTS_PATH ?? "/products";
  const promotionsPath = process.env.SEDIFEX_PROMOTIONS_PATH ?? "/promotions";

  const [productsPayload, promotionsPayload] = await Promise.all([
    fetchSedifexResource(productsPath),
    fetchSedifexResource(promotionsPath).catch(() => null)
  ]);

  const promotions = toPromotions(promotionsPayload);
  return toProducts(productsPayload, promotions);
}

export async function fetchSedifexPromo(): Promise<SedifexPromoProfile | null> {
  try {
    const payload = await fetchSedifexIntegrationResource("/integrationPromo");
    return toPromoProfile(payload);
  } catch {
    return null;
  }
}

export async function fetchSedifexPromoGallery(): Promise<SedifexPromoGalleryItem[]> {
  try {
    const payload = await fetchSedifexIntegrationResource("/integrationGallery");
    return toPromoGallery(payload).filter((item) => item.isPublished !== false);
  } catch {
    return [];
  }
}
