# Sedifex Integration Steps (Implemented)

1. Set `SEDIFEX_SYNC_ENABLED=true` in environment.
2. Configure `SEDIFEX_BASE_URL` and `SEDIFEX_API_KEY`.
3. If endpoint paths differ, override `SEDIFEX_PRODUCTS_PATH` and `SEDIFEX_PROMOTIONS_PATH`.
4. Restart app.
5. Validate response at `/api/sedifex/catalog`.

## Behavior
- When Sedifex sync is enabled and healthy, catalog data is fetched from Sedifex.
- If sync is disabled, fails, or returns empty data, static `src/data/products.ts` data is used as fallback.
- Product/promotional sync uses 5-minute revalidation and promo-time window checks.
