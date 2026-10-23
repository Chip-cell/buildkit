# BuildKit: candid product review

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
