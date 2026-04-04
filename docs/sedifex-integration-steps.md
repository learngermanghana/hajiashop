# Sedifex Integration Steps (Implemented)

## 1) Required settings to connect a Sedifex account

Set these in your production/staging environment:

```env
SEDIFEX_SYNC_ENABLED=true
SEDIFEX_BASE_URL=https://api.sedifex.com
SEDIFEX_API_KEY=your_sedifex_secret_key
SEDIFEX_WORKSPACE_ID=your_store_workspace_id
```

### Optional settings

```env
SEDIFEX_PRODUCTS_PATH=/products
SEDIFEX_PROMOTIONS_PATH=/promotions
SEDIFEX_TIMEOUT_MS=10000
SEDIFEX_WORKSPACE_HEADER=x-workspace-id
SEDIFEX_WORKSPACE_QUERY_PARAM=
SEDIFEX_REQUIRE_WORKSPACE_ID=true
```

- `SEDIFEX_PRODUCTS_PATH`: Change only if Sedifex gave you a different products endpoint.
- `SEDIFEX_PROMOTIONS_PATH`: Change only if promotions endpoint differs.
- `SEDIFEX_TIMEOUT_MS`: HTTP timeout in milliseconds.
- `SEDIFEX_WORKSPACE_HEADER`: header key used to send workspace/account id.
- `SEDIFEX_WORKSPACE_QUERY_PARAM`: optional query param name if Sedifex expects workspace in URL.
- `SEDIFEX_REQUIRE_WORKSPACE_ID`: when `true`, sync fails if workspace id is missing.

## 2) Sedifex account-side requirements

From Sedifex support/admin panel, confirm:

1. Your API key is active and has read access for products + promotions.
2. You have the correct **workspace/store ID** for this specific store account.
3. Your app/server IP is allowlisted (if Sedifex enforces IP restrictions).
4. You are using the correct base URL for your environment (sandbox vs production).

## 3) Verify connection

After deploying env vars, test:

- `GET /api/sedifex/catalog`

Expected result:

- `source` should return `"sedifex"`
- `count` should be greater than `0`
- `products` should contain live Sedifex records
- `workspaceId` should match the expected store workspace id

If `source` is `"static"`, the app is in fallback mode (disabled config, network/auth failure, or empty Sedifex response).

## 4) Runtime behavior

- When Sedifex sync is enabled and healthy, catalog data is fetched from Sedifex.
- If sync is disabled, fails, or returns empty data, static `src/data/products.ts` data is used as fallback.
- Product/promotional sync uses 5-minute revalidation and promo-time window checks.


## 5) How to know if this store is using Sedifex right now

Use any of these checks:

1. Open `GET /api/sedifex/catalog`.
   - If `source` is `"sedifex"`, the storefront is currently using live Sedifex data.
   - If `source` is `"static"`, it is using local fallback product data.
2. Verify `SEDIFEX_SYNC_ENABLED=true` in the deployed environment.
3. Confirm `SEDIFEX_BASE_URL` + `SEDIFEX_API_KEY` are present (not empty) in deployment settings.

## 6) Should these settings be on Vercel?

Yes—if this store is deployed on Vercel, set Sedifex keys in **Vercel Project Settings → Environment Variables**.

Recommended placement:

- **Production**: real Sedifex production key/base URL
- **Preview**: Sedifex sandbox key/base URL (or keep sync disabled)
- **Development**: use local `.env.local` while testing

Important:

- After changing env vars on Vercel, redeploy so changes take effect.
- Keep `SEDIFEX_API_KEY` server-side only (never `NEXT_PUBLIC_*`).
