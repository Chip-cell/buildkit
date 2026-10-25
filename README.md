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

The 29 sourced configurations recorded on 24 October 2026 are in `data/laptop-additions-2026-10-24.json`: 28 additions and one refreshed existing Nitro 5 Pro record. They span Acer Aspire, Swift, Nitro and Predator, ASUS Vivobook, TUF, ROG Strix, Zephyrus and ProArt, and HP Victus and HyperX OMEN. Each includes an exact SKU, a first-party India store URL, the observed date, and explicit unknown fields. Read the linked product page before changing a record. Do not copy specifications from a different SKU or manufacture a product URL.

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

Obviously malformed model numbers and processor descriptions remain inspectable in all-specifications mode, but cannot create purchase offers or drive budget matching. This is a conservative record-quality gate, not a certification of the remaining legacy data.

Dragging the laptop budget slider now means **all eligible prices up to that amount**. Explicit quick ranges retain their stated lower bound. Source dates, GPU power differences and unconfirmed stock remain per-SKU facts.

## Landing page

The landing page uses the promise **Buy the right computer. Understand every choice.** It includes keyboard-accessible hardware lessons, separate desktop/laptop workspace tabs, a small sourced laptop shelf, and buying FAQs. Shelf examples are not benchmark-tested recommendations; legacy-platform examples are kept in the finder rather than promoted on the landing page. Comparison does not name a performance winner when a selected model is unassessed.

## Scope and limitations

The legacy catalogue contains incomplete and inconsistently parsed records. This update is not an independent re-audit of every existing laptop, retailer URL, price or performance score. See `REVIEW.md` for the blunt assessment and the remaining priorities. No price collection service is configured in this repository. The HTML refers to older generation tooling that is not present here; do not assume those comments describe an available pipeline.

## Claim audit and comparison safeguards — 24 October 2026

`audit.html` provides a searchable inventory of every stored laptop field, score and current-offer assertion. Run `node scripts/audit-claims.cjs` after updating the catalogue. It emits a compact JSON ledger and a downloadable CSV. The audit page loads those files only when opened; the finder does not load the full ledger.

The inventory contains 636 records and 36,391 entries, including missing values and editorial entries. This is complete inventory coverage, **not complete independent verification**. A review of 38 external pages confirmed 222 manufacturer-listed fields across 33 records and seven retailer model designations. 16,486 entries remain pending independent review, 12,894 are missing and 6,782 are editorial assessments. Category tags and confidence metadata are included in the inventory and must not be mistaken for independent measurements.

`data/laptop-corrections-2026-10-24.json` preserves field-level evidence and scope. It corrects MacBook Neo hardware details and seven malformed retailer model numbers, updates current offer SKU references, and preserves earlier price history and dates. A title check on a manufacturer store establishes only the four fields explicitly recorded in its evidence scope; it does not validate all other specifications. The source retrieval manifest records fetches, not certification of their contents.

Comparisons show recorded specifications, source-ledger links and explicit unknowns. They do not turn editorial scores, an integrated/discrete GPU label or mixed desktop/laptop scales into performance or value winners. Legacy scores cannot produce value verdicts without a benchmarked ranking status. Editorial sorting remains available and labelled. Upgrade slot counts do not imply an empty slot.

No backend is needed for the current static finder, local saved builds or this audit browser. Add scheduled source checks and reviewed data releases before adding a service. A backend becomes useful for shared accounts/saved builds, multi-editor approval, authenticated supplier APIs, or a continuously updated price/history service. API keys and collection jobs must remain server-side. A backend cannot supply missing evidence or resolve a manufacturer-store contradiction by itself.

Validation: catalogue regeneration is idempotent; the existing Node regression suite plus correction/provenance and comparison checks pass. Browser checks covered the mobile comparison, horizontal scrolling with sticky row labels, Neo search, audit exact-SKU search and audit rendering. No physical laptop, game benchmark, battery runtime or checkout/delivery test was performed.

## Full recorded-price sweep — 24 October 2026

All 699 stored offers were classified; all 676 recorded source URLs were attempted. Direct public-page retrieval was followed by rendered-page retries where access failed. The evidence distinguishes a single exact-model INR price from MRP, accessory prices, bank offers, configuration mismatches and structured prices that could not be corroborated in visible content.

313 exact-model displayed prices were corroborated: 205 pages reported in stock, 101 out of stock and seven had unconfirmed stock. 192 corroborated prices differed from the stored observation. The other 386 offers remain unverified: 182 model identities unconfirmed, 62 configuration mismatches, 47 access/server failures after retry, 41 without an unambiguous price, 24 structured-only prices, seven unavailable pages and 23 offers without source URLs. These numbers are quote outcomes, not claims that every product is purchasable or every hardware specification is correct.

`data/price-rechecks-2026-10-24.json` is the recorded result overlay, including source URLs, extraction methods, status, old/new price and evidence hashes. The companion CSV also inventories 151 component estimates and six setup allowances. Those allowances are not supplier quotes. Raw evidence snapshots were retained in the task workspace; no service credentials are included in this repository.

`node scripts/update-catalogue.cjs` reapplies the overlay after additions and specification corrections, preserving historical prices and dates. Failed checks never overwrite an old observed price or advance its observation date. Corroborated out-of-stock prices remain reference prices. Unconfirmed offers cannot bypass the purchase gate through the older retailer-listing flag. Price-check status and reasons are retained in the interface and linked from the audit page.

`node scripts/parse-price-evidence.cjs` runs the extraction boundary self-checks; `node scripts/apply-price-rechecks.cjs` checks update/history behavior; `node scripts/check-site.cjs` includes all-offer coverage, current-price and trust-gate regression checks. Catalogue regeneration is idempotent. The old laptop claim ledger incorrectly looked for raw `offers.p` rather than `offers.price`; this sweep fixes that missing-value accounting and adds dated retailer-price evidence without certifying unrelated specifications.

No cart checkout, postcode-specific delivery, payment-card discount eligibility, live monitoring or universal stock guarantee is implied. A blocked or mismatched source is explicitly unverified, not proof that the recorded price is wrong.

The price sweep also removes unsupported fixed rupee savings from the guide, prevents missing laptop prices from being treated as zero in the cheaper-alternative banner, and labels date-only observations without inventing an hourly check time.
