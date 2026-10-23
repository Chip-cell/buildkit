# BuildKit

A self-contained desktop builder and laptop catalogue for India, served by GitHub Pages at https://www.buildkit.co.in/.

Open `index.html` directly, or serve the repository with any static HTTP server. The page embeds its catalogue, scripts and styles; it does not require an application build or external fonts.

## Validate a change

Use Node.js 22 or newer:

```sh
node scripts/check-site.cjs
```

The check loads the actual inline application code, validates the sourced additions, checks price-evidence boundaries and unknown stock, exercises search and pagination, and checks desktop configurations across nine use/resolution combinations at ₹2,20,000. It is a regression check, not a replacement for browser testing or retailer verification.

## Maintain sourced laptop additions

The 24 October 2026 additions are recorded in `data/laptop-additions-2026-10-24.json`. Each includes an exact SKU, a first-party India store URL, the observed date, and explicit unknown fields. Read the linked product page before changing a record. Do not copy specifications from a different SKU or manufacture a product URL.

```sh
node scripts/update-catalogue.cjs
node scripts/check-site.cjs
```

The update merges these records into `window.__BK_EMBEDDED__` in `index.html`, preserves existing history, deduplicates repeated observations, and recalculates audit metadata. It can be run repeatedly without adding duplicate configurations. It does not recheck retailer pages or refresh their dates automatically.

## Price evidence

- **Observed store prices:** product-page and retailer-listing observations that pass the application's URL, stock, price and evidence checks. These are dated observations, not live checkout guarantees.
- **Exact product-page checks only:** the stricter subset backed by exact-SKU product-page evidence.
- **Browse all specifications:** also includes unpriced records and explicitly labelled owner estimates. Choose **All Budgets** to expose unpriced records; unknown prices cannot establish budget fit.

An owner-entered number cannot create a purchase offer. An unconfirmed stock state cannot create a purchase offer. New observations have a per-record snapshot reference so adding a recently checked SKU does not make unrelated, older prices appear freshly checked.

New laptops have no invented performance scores. They appear under **Recently checked**, are searchable and comparable by specifications, and carry **Performance ranking not assessed** until an editorial assessment is recorded.

## Scope and limitations

The legacy catalogue contains incomplete and inconsistently parsed records. This update is not an independent re-audit of every existing laptop, retailer URL, price or performance score. See `REVIEW.md` for the blunt assessment and the remaining priorities. No price collection service is configured in this repository. The HTML refers to older generation tooling that is not present here; do not assume those comments describe an available pipeline.
