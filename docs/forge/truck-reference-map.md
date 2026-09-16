# Truck reference intake and feature map

Intake: 2026-09-16. Scope: all six user-supplied images were opened and visually inspected from the provided local attachment copies. This document records image evidence; it does not certify a completed reconstruction.

The user identifies the pictured vehicle as their actual truck. That is **user-reported provenance**. The supplied files establish its depicted appearance, not independently verified ownership, camera calibration, manufacturing specifications, measured dimensions, or physical readiness. The model should be described as **reference-informed, with unmeasured proportions** until measurements and matching validation exist.

## File inventory

Every file decodes as **JPEG, RGB, 1536 × 1536 pixels**, although the supplied filenames end in `.png`. No EXIF tags were present. A decoder must use the actual file format; the filename suffix is not evidence of PNG encoding. Originals were inspected in place, not rewritten or copied into `public/` by this intake.

| Ref | Supplied filename | View | Bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| R01 | `01-1000077114.png` | Exterior, front three-quarter and visible side | 483815 | `feaf9ecaabdf8e062a3d6e6d234ab736057f4acddca6f3b1b2da77f071f22bef` |
| R02 | `02-1000077115.png` | Exterior, rear three-quarter and visible side | 485657 | `b74698c5e44130b7d782596b01092db4ef765cb70c4878b7980aa2b56c3dabe0` |
| R03 | `03-1000077116.png` | Interior aisle toward the end with a high white air-conditioning unit | 547355 | `22c381dddb4d30f7b2964523767c6c10a7c94f8deb9dbb12f5a08e355aa23d3a` |
| R04 | `04-1000077117.png` | Interior aisle toward the closed ochre divider and low wood surface | 579396 | `ae922a786e9be4d1df564bc639ef7cfc684962e5bf4950c3b3a53534d2f7f02c` |
| R05 | `05-1000077118.png` | Interior close-up: sink, worktop, chest freezer and open side aperture | 542322 | `8b2c2fbf9fd133ef92311725b53ac920733c37b0e961044f1ca566f5759bf5bf` |
| R06 | `06-1000077120.png` | Interior: elevated padded alcove with the folding divider open | 481553 | `6af5f265a398b565e05aa708fd1c5c7e3fc76c13a94c993007843c72a4114916` |

Attachment copies were provided under `/workspace/scratch/65529ea62875/upload/`. That transient path is an intake locator, not a deployed asset URL. The hashes above allow later source matching without publishing the supplied image bytes.

## Reading the evidence

- **VISIBLE**: directly identifiable in one or more supplied images.
- **INFERRED**: an authoring choice needed to make a complete model, including hidden geometry, depth, exact material properties and dimensions.
- **UNVERIFIED**: a physical, business or engineering claim that these images do not establish.

“Left” and “right” below refer to the image viewpoint when used. The images are not an orthographic survey, and opposite viewing directions can reverse the apparent sides. Do not label a feature driver-side or passenger-side without a confirmed vehicle coordinate mapping. Warm light and sunset reflections affect the apparent colours; PBR values are authoring choices.

## Exterior feature contract

These are the source criteria used to review the current reference-informed model. The table records what the images support; the implemented geometry and deliberate simplifications are described in `blender-mcp-pipeline/FOODTRUCK.md`. It does not turn inferred measurements into source facts.

| Feature | Image evidence | What can be preserved | What must stay qualified |
| --- | --- | --- | --- |
| Dark body finish | R01, R02 | Charcoal/near-black glossy cab and tall box body; visible dark trim | Exact paint code, substrate and measured roughness are unknown |
| Cab and box silhouette | R01, R02 | Single-cab pickup profile, rear box appreciably taller than the cab, pronounced forward cab-over projection with sloping upper/front transition | Wheelbase, overall dimensions, centre of mass and construction method are unmeasured |
| Side windows | R01, R02 | Two visible rounded-corner rectangular windows with bright metal-looking perimeter trim | These views do not prove the same window count on the opposite exterior side |
| Body access panels | R01, R02 | Broad dark side panels, seams, hinges, handles and lower access details | Panel opening angle, internal hinge mechanism and permitted operating state are not proven |
| Roof edge | R01, R02 | Long perimeter rails/edge members above the box | Do not invent roof solar panels, tank capacity or roof load rating |
| Cab front | R01 | Angular bonnet, windscreen, mirror, dark bumper/grille, bright headlamp lens and red/orange side markers | Exact manufacturer/model/year, badge spelling and compliance are not established by this intake |
| Wheels | R01, R02 | Black steel-style wheels, dark tyres and visible wheel arches | Four-wheel placement is an authoring assumption for a complete vehicle; tyre specification and axle ratings are unknown |
| Rear corner ladder | R02; partial R01 | Narrow dark vertical ladder at the rear body corner | Rung dimensions and safe climbing loads are unknown |
| Rear access and step | R02 | Tall rear access panel/door area, lower louvered section, red lamp groups and projecting patterned rear step | Door operation, ventilation performance and structural load capacity remain unverified |
| Branding and labels | R01, R02 | Small labels/badges are visible | Do not add invented readable business branding, franchise status, registration or manufacturer certification |

## Interior feature contract

| Feature | Image evidence | What can be preserved | What must stay qualified |
| --- | --- | --- | --- |
| Aisle layout | R03, R04 | Central walking aisle with work/storage elements on both sides | Exact clear width, working clearances and physical accessibility are unmeasured |
| Upper storage | R03–R06 | Glossy black upper cabinets along both sides, dark frames and small round pulls | Exact compartment count and internal shelving are partly occluded |
| Wood appearance | R03–R06 | Warm wood-grain ceiling, wall panels, cabinet end panel and low horizontal surfaces | These images do not distinguish solid wood, veneer or laminate |
| Floor finish | R03–R06 | Reflective silver diamond/checker plate pattern across the visible floor | Alloy, thickness, friction and sanitation properties are not established |
| Sink and counter | R03, R05; partial R04 | Stainless-looking worktop, recessed sink area, curved faucet and sliding lower cabinet fronts | Plumbing, water/waste tanks, pressure, potable-water suitability and exact basin count/size are not certified |
| Chest freezer | R03, R05 | White rectangular top-opening appliance beside the sink counter; small controls visible in R05 | Storage temperature, model/capacity, power draw and operating state are unknown |
| Opposite workstation | R03, R04 | Raised metal work/storage unit, adjacent counter, wood-grain end panel and handles | Appliance function and hidden equipment cannot be inferred from the closed surfaces |
| Large side openings | R03–R05 | Dark framed open side apertures with visible support struts and nearby projecting ledge/shelf | Open/closed poses should be separate modeled states; physical operation and lock safety are unverified |
| Ceiling lights | R03–R06 | Warm round recessed/downlight appearances along the wood ceiling | Counts outside the frame, wiring and electrical ratings are unknown |
| Service lights | R03–R05 | Black cylindrical spotlights along one opening; two black pendant-style shades visible on the opposing view | Warm appearance is a visual target, not a lux measurement or certified fixture specification |
| Air-conditioning unit | R03 | High-mounted white wall unit at the far end | Capacity, electrical supply and physical orientation relative to the chassis are unverified |
| Raised alcove | R04, R06 | Elevated wood-lined recess, dark padded surface, small side window, ochre folding/accordion divider; open and closed appearances are supplied | Sleeping occupancy, bed dimensions, safety and location over the cab are inferred unless confirmed |
| Low wood surface | R04, R06 | Long horizontal wood-grain surface beneath the alcove, dark support frame, lower recess and small step-like surface | Bench/worktop use and load capacity remain unverified |
| Electrical controls | R03, R05, R06 | White wall-mounted control/breaker boxes and outlet/control plates | Do not reconstruct live wiring, circuit ratings or a functioning electrical control system from photographs |
| Vent/grille | R06 | Small light-coloured slatted wall element beside the alcove | Its function and ventilation capacity are unknown |

## Inferences and deliberate omissions

1. **Scale:** no dimensioned `plan.jpg`, wheelbase measurement, interior measurements or camera intrinsics were supplied. Any numeric model size is a design parameter, not a measurement from these images.
2. **Hidden surfaces:** underbody, roof equipment, far exterior side, inside cabinets, chassis, plumbing and wiring are not fully shown. Keep hidden geometry simplified and mark omissions in the build receipt.
3. **Source agreement:** the six views appear intended to describe the same truck/interior, but perspective and reflections prevent a complete geometric fit. Do not claim photogrammetry or a calibrated digital twin.
4. **Scene versus product:** sunset, neighbouring buildings, parked cars and ground reflections describe the photographed setting. They are not truck components and need not be reproduced to match the vehicle.
5. **Asset rights:** the user supplied the references for this task. This intake does not independently establish rights to unrelated background businesses, small badges or third-party product marks. The model can preserve the visible forms without inventing readable marks.
6. **Physical control:** the app's drive/inspection modes are virtual. No engine, steering, lighting, kitchen appliance, GPS or electrical system on the real truck is connected by this reference intake.

## Current local implementation evidence

The earlier compact S×B concept has been replaced by the six-reference reconstruction. Its history remains in checkpoint `e604373`; the old 1.90 × 3.40 m concept parameters never represented measurements of the pictured truck. Current model bounds and estimated dimensions are documented in `blender-mcp-pipeline/FOODTRUCK.md`; its approximately 2.05 m width and 5.60 m design length are authored estimates, not a surveyed specification.

The replacement is present as editable structural/final `.blend` sources, the public GLB, embedded procedural wood/metal textures and three native Blender Cycles renders. The generator explicitly records `browserIntegration: NOT_VERIFIED_BY_GENERATOR` and `humanApproval: NOT_CLAIMED`.

| Gate | Current evidence | Status / boundary |
| --- | --- | --- |
| Source intake | Six original hashes and visual feature inventory above | Complete; originals remain outside the public asset bundle |
| Reference-informed geometry | `blender-mcp-pipeline/build_foodtruck.py`, `reference_interior.py`, `assets/foodtruck-structural.blend`, `assets/foodtruck-final.blend`; retained features/omissions in `FOODTRUCK.md` | Locally generated and retained; dimensions and hidden construction remain estimates |
| Structural lock | `evidence/foodtruck/source-verification.json`: independent reopen compares 38 objects; rejects opening a stored runtime joint, a 1 cm windshield vertex change, and a missing wheel anchor | PASS for the replacement source; all three deliberate mutations rejected, no mutated scene saved |
| Export validity | `public/models/foodtruck-body.glb`: 1,209,436 bytes, 20,026 triangles; `evidence/foodtruck/khronos-validation.json` reports zero errors and zero warnings | Local PASS; format/budget validity is not browser or physical-vehicle validation |
| Rendered views | `public/images/foodtruck-preview.webp`, `foodtruck-interior.webp`, `foodtruck-rear-interior.webp`; all decoded as 1280 × 960 WebP | All three final Cycles renders were admitted by independent visual review; they are renders of the model, not new photographs or a measured-match certification |
| Drive integration | `src/drive/data/vehicle.ts`, `systems/truck-asset.ts`, `world/FoodTruckBody.tsx`; current drive/asset/vehicle test handoff records 17 passing tests | Local checks passed; exact-commit browser driving, camera framing and fallback acceptance remain pending |
| Inspection interaction | `src/components/foodtruck/truck-showroom.tsx`: exterior plus two interior views, click-operated hatches, exterior orbit/zoom, reset, and three-render fallback when WebGL is unavailable | Implemented locally; `scripts/browser-showroom.mjs` is the authored CI gate, not an executed PASS |
| Release acceptance | Updated Node 22/24 workflow, truck/showroom browser evidence and screenshots tied to the next exact source commit | Pending subsequent CI and review of its results |

Current integration handoff: **322 local tests passed, 4 explicitly skipped; TypeScript, ESLint and build passed; 16 Blender Python tests passed.** These are local checks, not a completed new remote CI run.

Replacement GLB SHA-256: `02c263c45ac75b6555dbbe78164375d938384154d1be3f83733128b5e88fcc01`. Its actual file size and digest were checked against the receipt during this document update.

Replacement structural digest: `0cf0d3f8e3ea6d785d9c3224ee2465b3323d24d7c0e6a1944daa6331766a42b1`. See the source-verification receipt for the independently reopened final source and baseline file hashes.

`ServingHatch_Pivot` and `OpposingHatch_Pivot` remain closed in the sealed source/export. The showroom opens only cloned runtime poses; interior selection opens the hatches. The rear door remains closed. Exterior view supports orbit and zoom; the two interior choices use fixed inspection framing. Without WebGL, selecting each view shows its corresponding real Blender render, while hatch interaction is disabled.

Foundation commit `33093b` had 321 passing tests and four explicit skips, plus successful type/lint/build/14-route gates in [run 35073030132](https://github.com/ton36475-lgtm/driveto3dworld/actions/runs/35073030132). That run exposed browser-result classification and HUD defects subsequently repaired. It is not a green verdict for the repaired reconstruction/showroom tree. The earlier fully passing `60a73e5` run also does not certify these new assets.

Blender, spatial and independent-checker ownership remains separate: source/export evidence belongs to the asset build; real rendered interaction evidence belongs to browser CI; root integration binds those results to the release commit. This document changes no code, model sources, original images, public deployment or external accounts.
