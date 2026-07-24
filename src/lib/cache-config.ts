export const DEFAULT_PUBLIC_CACHE_SECONDS = 60 * 60;
export const DEFAULT_PUBLIC_STALE_SECONDS = 60 * 60 * 24;
export const DEFAULT_MUTATION_TIMEOUT_MS = 10_000;

function toPositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export function getPublicCacheSeconds() {
  return toPositiveInteger(process.env.NEXT_PUBLIC_CACHE_SECONDS, DEFAULT_PUBLIC_CACHE_SECONDS);
}

export function getPublicStaleSeconds() {
  return toPositiveInteger(process.env.NEXT_PUBLIC_STALE_SECONDS, DEFAULT_PUBLIC_STALE_SECONDS);
}

export function getPublicCacheControlHeader() {
  return `public, s-maxage=${getPublicCacheSeconds()}, stale-while-revalidate=${getPublicStaleSeconds()}`;
}

export function getMutationTimeoutMs() {
  return toPositiveInteger(process.env.SEDIFEX_MUTATION_TIMEOUT_MS, DEFAULT_MUTATION_TIMEOUT_MS);
}
