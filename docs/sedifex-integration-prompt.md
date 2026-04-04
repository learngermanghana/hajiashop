# Sedifex Data Pull Setup Prompt (for Another Website)

Use this prompt when you want a developer or AI agent to implement the same Sedifex live sync used by Glittering.

## Copy-paste prompt

```txt
We currently pull live product and promo data from Sedifex for the Glittering website.
Implement the same integration for a new website with production-safe sync behavior.

Project goals
1) Pull products, categories, inventory, pricing, and promotions from Sedifex.
2) Keep data synchronized with minimal delay.
3) Ensure promo logic is accurate and timezone-safe.
4) Make the integration idempotent, observable, and easy to maintain.

Deliverables
A) Discovery and prerequisites
- Confirm Sedifex auth method (API key/OAuth), required scopes, and token rotation.
- Document base URLs for sandbox + production.
- Confirm any IP allowlisting and webhook signing requirements.
- Produce endpoint list for:
  - products
  - categories
  - prices
  - stock/inventory
  - promotions
  - changed-since or delta feed

B) Data contract and mapping table
- Map Sedifex -> new site schema, including:
  - product_id, sku, slug, title, description, brand, category
  - list_price, sale_price, promo_price, promo_start_at, promo_end_at
  - currency, tax flags
  - inventory_status, inventory_qty
  - image URLs and gallery
  - product status (active/inactive/discontinued)
- For each field include: required/optional, default fallback, transform rules, and validation.

C) Sync design
- Build initial full import.
- Build incremental sync using updated_at cursor and/or webhooks.
- Frequency:
  - price/promo updates: every 5–15 minutes
  - inventory updates: every 5 minutes (or webhook-driven)
  - product metadata updates: hourly
- Add idempotency keys and deduplication by source record ID + updated timestamp.

D) Promo engine rules
- Define priority when multiple promos overlap (e.g., category vs SKU promo).
- Respect promo time window with explicit timezone conversion.
- Define conflict behavior between Sedifex promos and local/manual website coupons.
- Ensure expired promotions are removed automatically.

E) Reliability and security
- Implement retry with exponential backoff + jitter for 429/5xx.
- Add request timeout, circuit-breaker behavior, and rate-limit compliance.
- Persist sync checkpoints and failure reason logs.
- Store secrets in env/secret manager only; never expose tokens client-side.
- Validate webhook signature and reject replays.

F) Implementation details
- Create modules/services:
  1. sedifexClient (API calls)
  2. sedifexMapper (field transformation)
  3. sedifexValidator (schema validation)
  4. sedifexSyncJob (full + incremental)
  5. promoResolver (promotion conflict resolution)
- Provide upsert strategy and transaction boundaries.
- Include audit fields: source_system, source_id, synced_at, last_seen_at.

G) QA and rollout
- Unit tests for mapping, promo precedence, and timezone boundaries.
- Integration test using sample Sedifex payloads.
- Staging dry run + data reconciliation report.
- Production rollout checklist and rollback plan.

Output format required
1) Architecture diagram (simple text or Mermaid).
2) Endpoint inventory table.
3) Field mapping table.
4) Step-by-step setup runbook.
5) Monitoring/alert rules (error rate, stale data, sync lag).
6) Go-live + rollback checklist.
```

## Notes for implementers

- Keep source-of-truth ownership clear (Sedifex vs local overrides).
- Use UTC in storage and convert to storefront timezone at display/promo-evaluation boundaries.
- If Sedifex supports webhooks, treat polling as fallback for missed events.
