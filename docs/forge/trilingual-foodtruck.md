# Trilingual portfolio and food truck release candidate

## User-directed extension

Extend the canonical `driveto3dworld` portfolio, which already reconciles the three supplied repositories, with Thai, Simplified Chinese and English; purposeful motion; an original Blender food truck; and useful real-world handoffs. Preserve existing local operations, auth/database-off defaults, project provenance, accessible fallback, and A-left/D-right controls.

This phase follows verified checkpoint `60a73e5ffe4e094c0d325e5d8084beeb3dcefdc4`. Both Node 22 and 24 passed [CI run 35070021809](https://github.com/ton36475-lgtm/driveto3dworld/actions/runs/35070021809), including actual reduced-motion frame idling and context-loss recovery. That checkpoint does not certify the new changes in this document.

## Product and design contract

- Audience: visitors exploring the shared creative portfolio, and an owner preparing a small food-truck menu and route.
- Languages: stable stored codes `en`, `th`, `zh`; Chinese HTML language `zh-CN`; preserve previous valid EN/TH preferences. Names and brand marks remain unchanged.
- Visual direction: ink, bone, cool silver, readable multilingual typography; a serving-side Blender render forms the new `/foodtruck` hero. Real business data starts empty.
- Motion: one route entrance (420 ms opacity/8 px travel), one truck-image entrance (850 ms), card hover/focus cues; transform/opacity only. No continuous decorative loop. Reduced-motion removes these animations and hover transforms; existing 3D pause/visibility rules remain.
- Layout: keyboard controls and language buttons remain reachable at 360/390/768/1440 pixels. No clipped form controls or horizontal page overflow.
- Model: editable structural/final `.blend` sources, static GLB body with separate runtime wheels, conservative body clearance, camera framing and geometry fallback. Actual viewport rendering is a separate gate from offline glTF validity.

## Working boundaries

`/foodtruck` supports a truck name, HTTPS contact/order page, THB/USD/CNY menu amounts, names in all three languages, sold-out flags, edit/delete, dated stops, manual map handoff, and validated JSON backup/restore. Prices are stored as integer minor units. Times entered in the UI explicitly use Bangkok (UTC+07); imported offsets are validated and displayed in Bangkok time. A time window never asserts live availability.

Plans persist in this browser under `sxb-foodtruck-v1`; there is no cloud sync, published menu, order backend, payment flow, GPS feed, delivery dispatch, or physical vehicle control. The map link contains the owner's coordinates and opens only on click. Existing Facebook contact remains the previously confirmed personal link; no new account or contact details are invented.

Admission is strict, bounded to 128 KiB UTF-8, at most 40 menu entries and 40 stops, unique UUIDs, valid calendar/coordinate ranges and safe external URL schemes. Import presents a replacement preview; invalid files preserve the existing plan. A newer file selection invalidates older asynchronous reads. Cross-tab changes refuse stale saves; localStorage is not a transactional multi-user database.

Legacy operations backups retain EN/TH bytes and accept missing Chinese. Untranslated legacy ready drafts become drafts with an explicit translation notice. No automated translation is silently presented as approved marketing.

## Third-party sources

- Google Maps' [documented universal URLs](https://developers.google.com/maps/documentation/urls/get-started) support the manual directions handoff (`api=1`, destination, driving). No Maps API credential is needed or stored for this link.
- [Fontsource Noto Sans SC](https://fontsource.org/fonts/noto-sans-sc/install), `@fontsource-variable/noto-sans-sc@5.3.0`, OFL-1.1, is pinned in the lockfile and served locally. Its unicode subsets load when used. License copied to `public/fonts/Noto-Sans-SC-OFL.txt`. No runtime Google Fonts request is needed.
- Blender source/render/structure/Khronos evidence is in `blender-mcp-pipeline/FOODTRUCK.md` and `evidence/foodtruck/`.
- GhostClaw Art Engineering and 3D Product Forge were used. No installed Superpower/Ponytail skill was found; their use is not claimed.

## Acceptance and evidence

| Requirement | Verification |
|---|---|
| Locale storage, copy parity, Forge schema and profile/work content | `scripts/locale.test.mjs` |
| All Drive locales and old save compatibility | `src/drive/systems/localization.test.ts`, `save.test.ts` |
| Operations legacy migration and complete Chinese drafts | `src/lib/ops/ops.test.ts` |
| Price, URL, calendar, coordinate, backup and truth-state negatives | `src/lib/foodtruck/model.test.ts` |
| Actual shipped GLB loading, isolated clones, anchor bounds, malformed fallback | `src/drive/systems/truck-asset.test.ts`, `vehicle.test.ts` |
| Language switching/persistence, mobile layout, real menu/stop editing, import races and actual downloads/restoration | `scripts/browser-locales.mjs` in production CI |
| Existing operations and spatial regressions | `browser-ops.mjs`, `browser-spatial.mjs`, `browser-smoke.mjs` |
| Build, types, lint, clean installs and HTTP routes | `.github/workflows/runtime.yml`, Node 22/24 |

Independent review found and repaired stale sold-out status during price editing, an asynchronous import-selection race, and missing React list keys. Remaining browser results must be tied to the exact subsequent commit and run, not inferred from this document or the previous passing checkpoint.

Rollback: review/revert the additive phase commit(s) to the prior passing checkpoint; preserve newer owner changes and exported local plans. No production deployment or main-branch merge is performed by this phase.
