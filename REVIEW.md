# BuildKit: candid product review

## Gaming release

The publication pass adds eight further gaming SKUs and refreshes the existing Nitro 5 Pro UN.U7MSI.007 without duplicating it. The new configurations are ASUS FX608JHI-TU225WS, FA608PP-QT014WS, G614PR-RV032WS and V3607VJ-TK227WS; HP E20RNPA#ACJ and E26Q2PA#ACJ; and Acer UN.U4QSI.003 and UN.U46SI.004. The catalogue now holds 636 records, with 29 sourced configurations overall. Twenty pass the strict product-page price gate; 436 have eligible observed-price offers including retailer listings.

Displayed stock for the new HP and Acer records was observed on their exact manufacturer-store pages. ASUS stock remains unconfirmed, so those models stay reference-only. The HP 15-fb3382AX store description calls its processor “Ryzen 7 7445H”; this is explicitly flagged for buyer confirmation. Source URLs, full configuration details and the base prices observed are retained in the JSON source records. No checkout or independent performance test is implied.

## Follow-up: the landing page needed a stronger reason to exist

The first redesign looked cleaner, but it still repeated the same navigation in several large boxes. It explained that BuildKit could build or find a computer without demonstrating the promised understanding. A prominent heading, more rounded cards and a bigger SKU count would not solve that problem.

**Changed in the follow-up:** the promise is now **Buy the right computer. Understand every choice.** Three keyboard-accessible lessons explain graphics, memory and displays; each leads to the matching guide chapter. A compact desktop/laptop workspace replaces duplicated introductory cards. The laptop workspace includes sourced examples and their trade-offs, exact model numbers and source dates. Buying principles and four practical FAQs explain what the site can establish.

Two functional issues also needed fixing. The laptop budget slider excluded everything below half its value despite being labelled a ceiling. It now includes all cheaper eligible models; explicit labelled ranges retain their lower limits. Comparisons also treated missing assessments as scores. An unassessed model now blocks automatic performance verdicts instead of becoming an assumed loser. Shortlist badges use recorded facts—lowest observed price or lowest recorded weight—rather than unsupported “best battery” or “best gaming” claims.

Value alternatives now also require the same recorded OS and architecture family. A Windows-on-ARM model is not treated as a drop-in value replacement for an x86 Windows model. This still does not establish compatibility with a buyer's individual applications or peripherals.

**Current evidence:** 628 catalogue records; 431 configurations with eligible observed-price offers, including 15 that pass the strict product-page trust gate. Twenty exact configurations were sourced during these two passes, with twelve added in the follow-up. The new entries include affordable Aspire models, three Nitro configurations, TUF variants with explicitly different 115W and 85W GPU limits, a Zephyrus G14, a ProArt P16, HP Victus and HyperX OMEN. ASUS stock was not unambiguously confirmed, so those entries remain reference-only. Coupon prices were not substituted for base selling prices.

The follow-up identified **26 records requiring model-number or processor-description review**. Those records remain inspectable in all-specifications mode but cannot create purchase offers or establish budget fit. This is a basic quality gate; it does not establish that the remaining legacy records have been independently verified.

**Further criticism:** factory specifications are not independent testing. Battery capacity does not establish runtime, a GPU name does not establish sustained performance, and a store's “in stock” text does not guarantee delivery. Acer's page for UN.U7CSI.007 even describes RTX 4050 memory as GDDR7; that contradiction is exposed instead of copied into a memory-type field. The site still needs a systematic legacy-SKU audit and a published, reproducible assessment method. Neither a larger catalogue nor the new design substitutes for that work.

The following sections preserve the baseline assessment and findings from the first pass; their 608/616-record figures describe those earlier states.

Reviewed 24 October 2026 against repository main `365c0f4` and the local revision in this branch.

**Assessment:** BuildKit has a useful core, but the previous presentation promised more certainty than the evidence supported. A larger catalogue does not compensate for weak verification. Before marketing this as an authoritative buying service, improve the records and the evaluation method.

## 1. Trust was the most serious weakness

The original embedded file had 608 configurations while its audit metadata still said 147. The raw catalogue, visible eligible offers and actually checked product pages are different populations. Treating them as interchangeable makes a large number look more useful than it is.

The application also allowed owner-entered prices to create buyable offers pointing to retailer searches. Separately, laptop link validation could accept an observation that the general offer-trust function rejected. Two definitions of “verified” are a recipe for accidental misrepresentation.

**Changed:** owner estimates cannot create purchase offers; product-page links must pass the same trust gate as prices; the UI distinguishes listing observations from product-page checks; audit metadata is regenerated. The revised unfiltered catalogue has 616 records, 448 eligible observed-price configurations, including seven that satisfy the strict product-page trust gate. These are snapshot counts, not a claim that 448 machines are available at checkout today.

## 2. The rankings sounded more scientific than they were

“Best battery”, “great value” and “poor value” are strong claims. Editorial scores are useful only when their assumptions and missing evidence are clear. On initial testing, adding an unscored laptop made it receive a poor-value warning because missing scores became zero. That is missing data being presented as a verdict. Comparing a Windows notebook with a Chromebook or Mac on one aggregate score also ignores software requirements.

**Changed:** unassessed additions do not receive value verdicts; explicit editorial language replaces benchmark implications; value comparators respect the broad Windows/macOS/ChromeOS distinction. The default order is recently checked, and sorted results no longer automatically wear “top pick” labels.

**Still needed:** publish a reproducible scoring rubric and supporting measurements. Existing scores were not revalidated. OS matching alone does not establish workload equivalence or application compatibility.

## 3. Some legacy records are visibly malformed

Examples from the original file include an ASUS TUF record whose CPU is “TUF Gaming F16” and whose part number begins “(I5”, plus records using a family word such as “INSPIRON” as the part number. The UI cannot honestly promise exact configurations for every such entry.

**Still needed:** re-audit legacy records against exact manufacturer SKUs, separate family-level descriptions from SKU-level evidence, and quarantine ambiguous records. This pass preserves the older records rather than guessing repairs.

The new source pages are not flawless either: Acer's UN.38GSI.005 uses both OLED and IPS wording, and UN.37RSI.003 lists UHD graphics for a 226V model. Those contradictions are exposed on the cards; the uncertain panel field remains unknown.

## 4. Browsing concealed the catalogue

The old finder reported its full match count while rendering only the first 30 cards, with no route to later results. Many unpriced records were inaccessible through the finder. A large brand count followed by almost no visible results feels broken even when filtering is technically correct.

**Changed:** show-more pagination, a visible rendered/total count, one prominent search field, an explicit all-specifications mode, and clearer empty-state guidance. Unknown prices are not placed inside a budget range.

## 5. The interface demanded too much reading

Similar bordered rectangles, small uppercase labels, repeated warnings and dense three-column cards flattened the hierarchy. The two-second artificial loading delay added friction without loading useful information.

**Changed:** stronger headline and primary actions, a quieter copper visual system, clearer spacing, two-column specification cards, live catalogue counts, explicit source dates and retailer names. The artificial minimum loading delay is removed. Responsive styles are included, but this pass's visual QA was in the desktop in-app browser; a physical mobile-device pass remains worthwhile.

## 6. Maintenance needs discipline

A 2.8 MB hand-maintained HTML document combines application code, style and a large dataset. It is portable, but accidental data and code changes are hard to review. Comments referring to absent scripts are not an operating data pipeline.

**Changed:** source records for the eight additions, an idempotent catalogue merge script, documented maintenance commands and regression checks. A framework rewrite would not fix bad evidence, so one was not introduced.

**Next priority:** recheck the older catalogue and document the ranking method. A recurring collector, error alerts and human review can follow once the evidence contract is stable. No collector or recurring monitoring was added here.

## New source evidence

Eight exact configurations were added after reading first-party India store product pages. The JSON additions file contains the full URLs and fields observed for each SKU.

| SKU | Configuration | Observed price | Stock evidence |
| --- | --- | ---: | --- |
| UN.35MSI.012 | Acer Aspire 15 AS15-42; Ryzen 7 7730U; 16GB / 512GB | ₹54,999 | In-stock text on product page |
| UN.38GSI.004 | Acer Swift Neo SFN14-56; Ultra 5 226V; 16GB / 512GB | ₹72,999 | In-stock text on product page |
| UN.38GSI.005 | Acer Swift Neo SFN14-56; Ultra 5 226V; 16GB / 512GB | ₹77,999 | In-stock text; panel wording conflicts |
| UN.37QSI.005 | Acer Swift Neo SFN14-55; Ultra 5 125H; 16GB / 512GB | ₹79,999 | In-stock text on product page |
| UN.38GSI.006 | Acer Swift Neo SFN14-56; Ultra 7 256V; 16GB / 512GB | ₹82,999 | In-stock text on product page |
| UN.37RSI.003 | Acer Aspire 5 A514-55; Ultra 5 226V; 16GB / 512GB | ₹84,999 | In-stock text; GPU wording needs confirmation |
| UN.37TSI.008 | Acer Swift Pro SFP14-55; Ultra 5 125H; 16GB / 512GB | ₹84,999 | In-stock text on product page |
| X1607CA-MB350WS | ASUS Vivobook 16; Ultra 5 225H; 16GB / 512GB | ₹88,990 reference | Stock not confirmed; no purchase offer |

Prices were observed on 24 October 2026 without bank, coupon or checkout verification. These observations do not establish long-term value, measured battery life, benchmark performance or future availability.
