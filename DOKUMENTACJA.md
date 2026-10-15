> Dokumentacja projektu źródłowego. W tym eksporcie pliki opisywane jako `dist/…` znajdują się bezpośrednio obok `index.html`. Skrypty importujące dane i testy opisane w sekcji Verification należą do projektu źródłowego i nie są potrzebne do działania strony. Instrukcja uruchomienia tej paczki: INSTRUKCJA.txt.

# Kuźnia — Broken Ranks

Polish static build calculator. Serve `dist/` over HTTP. No backend or third-party runtime is required. Google Fonts is optional with system fallbacks.

## Features

- Twelve equipment slots; 283 selectable catalog entries, 19 sets and 22 synergy families with level selectors. Quest and ordinary items are excluded from selection and new custom-item types; existing builds can still resolve their original records.
- The item picker groups and filters by T1 (ranks 1–3), T2 (4–6), T3 (7–9) and T4 (10–12). Synergy previews and equipped levels respect the selected tier. Historical records, skins, alternate epics and duplicate item variants are excluded. Legacy synergy IDs migrate to their family and level.
- 363 locally cached factual equipment thumbnails, including synergy appearances at different levels. Source image URLs are retained for attribution.
- Drif backpack with direct additions, exact transfers from/to equipment, safe swaps, and preservation of removable drifs when replacing or removing an item. Backpack contents do not affect power and are included in local saves and native JSON exports. Legacy builds load with an empty backpack.
- Illustrated drif catalog with all 120 WikiBR size/effect thumbnails, name/effect search, size selection and compatibility filtering. All drif level controls are sliders; equipped sliders update power and capacity without replacing the focused control. Built-in epic drifs remain bound, and sets retain their existing maximum-level calculation rule.
- Build optimizer for total power or ordered modifier goals: maximize, reach the hard cap, or reach a chosen value. It redistributes owned drifs and orbs across current equipment, with a preview, explicit apply, safe undo and optional item locks.
- Orb backpack with direct additions, editing and validated placement. Removable orbs are preserved when taking off or replacing equipment; leftovers and duplicates survive native exports and local saves.
- Ordered upgrades; separate normalized inlay pools for character statistics and resistances. Planning shows the expected equal allocation, explicitly labelled as a mean, not an exact random game roll.
- Drif penalties, additive item amplification and combined hard caps. Percentage bars share one scale and show cap markers.
- Overlay clipboard/TXT/JSON import with a review step, plus native JSON import/export and explicitly requested device-local saves.
- Skills: local WikiBR icons, short descriptions, values for the selected level, and source mechanics/formulas. Three yellow/orange/red mastery circles and seven numbered level circles preserve the flat imported 0–21 levels. All seven classes are available in the skill view. Duplicate source records remain grouped and export losslessly; unsupported ranks are disabled. Fixed general actions do not invent a progression. Combat outcomes and training-point costs are not simulated.
- Skill data covers 1,384 source rows: 63 class skills × 21 levels, three special skills × 14, five fixed actions and 14 Wataha levels. All 75 definitions have original local images; three legacy-only names have no fabricated current values. Wataha uses the icon area of an unmodified WikiBR banner.
- Feature-detected WebMCP read/configure tools.

## Overlay import

`dist/importer.js` reads the provided schema (`stats`, `skills`, `equipped`, `equipmentList`). It selects items by equipment IDs and numeric slots, ignores unequipped items/skins, and preserves final exported item statistics. The user's real character export is used only as a local test input and is never bundled with the site.

Imported final statistics are snapshots: ornament and earlier upgrades are not applied twice. Aggregate upgrade information and the current upgrade number are retained, but the missing order is not fabricated. New upgrades start at the next ordinal. Starting a fresh base-item simulation explicitly discards the item's imported snapshot after a confirmation in the app.

The supplied format lacks profession, charge state, weapon damage and stamina fields. `Durability` is deliberately not interpreted as stamina. The review lets the user select profession/charge; missing item statistics are estimated from the catalog and remain unresolved until the user confirms them. Known final exported values take precedence over catalog values.

Numeric orb effect codes have no verified name map yet. Imported effects and sizes/levels are preserved, but the user must identify each code before its power can be calculated. Names assigned to a code propagate across that build and survive native export/import. Unknown orbs never silently disappear. The source's original Might is displayed separately; incomplete results are visibly marked as estimates.

## Mechanics and provenance

Factual WikiBR tables imported on 2026-10-09, with source links per item. `scripts/import_wiki.py` regenerates `dist/catalog.json` from a supplied directory of WikiBR HTML (BeautifulSoup required). Then run `scripts/fetch_assets.py` to cache thumbnails. `scripts/import_skills.py` imports level tables and factual mechanics from WikiBR, with short separately authored descriptions and cached original skill icons. Legacy imported skill names retain their data without fabricated current values. Wataha rows were verified against WikiBR revision 17993; the anomalous −111% value for Mierzony cios / Uczeń II is preserved with an explicit uncertainty note.

User-confirmed rules: set/synergy fixed bonuses bypass repeated-drif penalties but combined effects obey caps; socketed epic/set drifs increase n; requirements use only base character stats; only the strongest charged orb of an effect contributes power; resource upgrade points give ten units; order matters; newly upgraded stats cannot join the inlay pool. Synergies cannot be ornamented.

Item boosts and ornament boosts add. Psycho is rounded upward to two decimals. Total power is rounded upward to a whole number after summing unrounded component values. Item-stat integer rounding is retained from the previous specification. Planned random inlay allocation is an expected value; final item values are rounded only after allocation. Imported game rolls stay exact.

Orb amplification now adds an ornament fraction of the Suborb base. This reproduces both S1 records in the supplied export (base-three Magni 1 = 5.25; base-ten Magni 3 = 21). Generalization to higher ornaments is an explicit inference awaiting user confirmation. Imported orb effects always override this model until their level/size or item ornament is edited, or the orb is moved to a different item.

The catalog is a snapshot, not proof that every game item is present. Epik and Legenda remain different item types even if names coincide. Duplicate quest variants keep the first source entry. Custom corrections never mutate the source catalog.

Level-100 complete sets with discharged pieces retain at least the 4/5 ordinary bonus; PA/fate require every piece charged. Partially discharged set behavior is still a documented earlier assumption. More than 12 identical drifs is flagged as an unsupported penalty case. Saturation and temporary effects remain outside the calculator.

## Drif catalog

`scripts/import_drifs.py /path/to/Drify.html` extracts the exact WikiBR cards and caches their PNGs in `dist/assets/drifs/`. `dist/drifs.json` retains each original source URL. These assets were downloaded on 2026-10-12.

Inventory transfers validate capacity, rank, sockets, duplicate effects and weapon-only/element rules before mutation. Replacing an equipped drif moves the previous drif to the backpack; choosing an existing backpack drif consumes exactly that record. Set extraction preserves the stored level rather than inventing experience. Editing a level can still make a planned item exceed capacity, in which case the existing validation warning updates immediately.

## Build optimizer

`dist/optimizer.js` is a pure search module. It preserves gear, base points, skills, levels, sizes, inlay, upgrades and snapshots. Drif and orb sockets are independent, so both domains can be searched separately while preserving the ordered objective. Scoring uses the same per-item rounding, repeat penalties, set/synergy bypass, hard caps and strongest-orb rules as the engine. After the chosen targets, unrounded power breaks ties, then finite drif capacity use, occupied sockets and number of moves. Final displayed power still rounds upward once.

Small search spaces enumerate all legal assignments. Larger ones use multiple starts, greedy improvements, relocation, exchanges, and partial clearing to escape local optima. A 3/8/20/30-second budget is available. Approximate results are explicitly marked as the best found, never a certified global optimum. Valid original arrangements seed the search, so power mode cannot return a weaker build. The worker reports progress and supports cancellation; an asynchronous yielding fallback supports browsers without workers.

Built-in epic drifs and unknown imported orbs stay in place. Known imported orb observations are retained at their original item; moving them recomputes the effect from the destination's inlay, with an explicit UI note. This inherits the orb model's source limitations above. All physical records are conserved (including duplicate gems); unused records stay in the corresponding backpack. The native format adds optional `backpackOrbs`, defaulting to an empty list for old builds. Independent 1,000-record backpack limits remain enforced.

Search does not mutate the current build. Applying requires an unchanged source build and settings. Undo is available only while the applied build remains unchanged. Existing equipment requirements and unresolved source data remain visible in the result.

## Verification

- `node scripts/check-optimizer.mjs`: exact packing versus independent brute force, boost/rank restrictions, fixed epic drifs, maximum set levels, repeated-effect penalties, ordered goals/thresholds, hard caps, strongest orbs, unresolved import preservation, conservation, atomic stashing, and cancellation.
- `node scripts/check-optimizer-worker.mjs`: runs the actual worker module with a Node messaging adapter; checks progress, cancellation responsiveness and valid conserved output.
- Optimizer DOM checks exercise preview, apply/undo, ordered goals, target thresholds, stale-result protection, skill preservation, local save and orb backpack editing/placement. Existing drif, tier and skill DOM suites also pass.
- `node scripts/check-skills.mjs`: class data and image coverage, all 21 mastery/level mappings, duplicate preservation, bounded selections, cross-class imports and safe HTML rendering.
- Skill DOM checks exercise all seven classes, icons, descriptions, circle controls, displayed values, unsupported ranks, fixed actions and native save/import.
- `node scripts/check-drif-inventory.mjs`: nine focused checks for backpack power isolation, lossless transfers, duplicates, atomic swaps, fit rules, epic restrictions, set levels, legacy/native JSON, and all 120 local images.
- `node scripts/check-engine.mjs`: 21 regression checks for the existing calculation rules.
- `node scripts/check-import.mjs`: six additional checks for separate pools, synergy levels/migration, S1 orb data, all thumbnails, exact snapshot/skill preservation and malformed import rejection.
- `node scripts/check-import.mjs /path/to/overlay.txt`: also verifies every supplied final stat, equipment slot and orb effect in the real overlay input, without copying that input into source or deployment.
- Tier DOM checks covered all 48 slot/tier combinations, grouped ranks, excluded quest/ordinary choices, search and requirements filters, selected synergy levels, and integer power.
- Additional drif DOM checks covered illustrated picking, search and size filters, live sliders with stable control identity, two-way moves, replacement from catalog and backpack, automatic stashing on item removal, epic restrictions, native roundtrip and deletion of one inventory record.
- DOM interaction checks covered first render, allocation, catalog, upgrades, drifs/orbs, all tabs, image elements, percentage meters, invalid and valid paste preview, skills, missing-data edits, orb mapping, native roundtrip, synergy levels, comparison and WebMCP handlers.

A compatible native browser preview is unavailable in this environment; DOM checks do not constitute screenshot/layout verification. Exact equality with the supplied in-game power remains blocked by missing stamina/weapon values and the numeric orb-name mapping.
