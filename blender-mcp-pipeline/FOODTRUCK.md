# User-reference foodtruck reconstruction

The current asset reconstructs visible features from six user-supplied truck images. It replaces the earlier compact S×B concept, preserved in repository checkpoint `33093b55f5c7d2ba83729f5d67da3b3bc8c45030`. The supplied images establish appearance; they do not provide measured dimensions, vehicle engineering specifications, business operations or verified OEM identity. Scale, unseen construction and some fittings are modelling estimates. Illegible badges and invented large branding are omitted.

Reference filenames, SHA-256 fingerprints and the source-to-feature map are in [truck-reference-map.md](../docs/forge/truck-reference-map.md) and the build receipt. Original reference photographs are not bundled into the public site. The wood grain and checker-plate normal tile are original procedural textures, embedded in the GLB; no third-party model, font, material or stock image is used.

## Visible reconstruction

The exterior retains the charcoal pickup cab, long square hood, angular headlamp surrounds, mirrors, tall box, sloped cab-over sleeping pod, roof rails, two windowed side panels, lower hatches/latches, rear ladder, windowed entry, louvers, rear lamps and projecting step. Rounded forms and small hardware are simplified for real-time use.

The interior is actual retained geometry: timber lining and ceiling, glossy black overhead cupboards on both sides, a diamond-plate aisle, stainless sink and curved faucet, under-counter cabinets, a white chest freezer, an opposing worktop, pendants/downlights, a raised dark mattress, folded ochre partition, lower bench/step, rear AC and visual electrical-panel props. There are real apertures on both sides. Plumbing and electrical parts are visual props, not a fabrication or installation specification.

The folded partition leaves the sleeping bay visible. Side panels are closed in the baseline/export and open only in a cloned runtime inspection pose. There is no solid outer box hiding the interior.

## Runtime contract

- Root: `FoodTruck_Body`, extras `asset_contract: foodtruck-reference-v2`.
- Coordinates: metres, Y-up, vehicle front **−Z**, root at wheel-centre height and identity transform.
- Main body: about 2.05 m wide, 5.60 m overall design length, roof at Y 2.80 with rails/ladder near 2.89. Exact full mesh bounds are recorded in the receipt; these are measured model bounds, not surveyed vehicle measurements.
- Wheel meshes are not exported. The app owns four animated black steel wheels, radius 0.37 m and approximate width 0.23 m. Runtime ride height is 0.39 m.

| Anchor | X | Y | Z |
| --- | ---: | ---: | ---: |
| `WheelAnchor_FL` | −0.91 | 0 | −1.94 |
| `WheelAnchor_FR` | +0.91 | 0 | −1.94 |
| `WheelAnchor_RL` | −0.96 | 0 | +1.52 |
| `WheelAnchor_RR` | +0.96 | 0 | +1.52 |

| Approved joint | Closed position | Closed rotation | Opening operation |
| --- | --- | --- | --- |
| `ServingHatch_Pivot` | [1.045, 2.39, 1.04] | identity | local glTF Z = +1.35 radians |
| `OpposingHatch_Pivot` | [−1.045, 2.39, 1.04] | identity | local glTF Z = −1.35 radians |

The pivot transforms have no hidden Blender axis-conversion rotation. Each panel's glass, trim and body meshes remain children of its own pivot. Material-role merging is scoped to each parent before the structural lock; `source_parts` extras retain source component names. `RearDoor_Pivot` is separate but currently stays closed.

Clone the cached GLB before opening hatches, altering materials or removing lamp meshes; a parked showroom pose must never modify the cached scene or driving vehicle. If the app retains dynamic lamps, remove `Lamp_Front_0`, `Lamp_Front_1`, `Lamp_Rear_0` and `Lamp_Rear_1` from the clone. Front centres: X ±0.68, Y 0.78, Z −2.735. Rear centres: X ±0.78, Y 0.49, Z +2.543. The app keeps its geometry fallback while the file loads or if loading fails.

Suggested local camera positions before runtime ride-height offset:

| View | Camera | Target |
| --- | --- | --- |
| Kitchen / bunk | [0, 1.86, 2.28] | [0, 1.82, −0.65] |
| Rear kitchen / AC | [0, 1.86, −0.08] | [0, 1.52, 2.31] |

## Build and verification

Use the official checksum-verified Blender 4.5.14 LTS toolchain recorded by the atelier pipeline. Each run owns a newly named output directory; never share a writable `.blend` across workers:

```bash
blender --background --factory-startup --disable-autoexec --python-exit-code 1 \
  --python blender-mcp-pipeline/build_foodtruck.py -- \
  --output-dir blender-mcp-pipeline/build/reference-truck-NEW \
  --reference-dir /absolute/path/to/supplied/images
```

`build_foodtruck.py` owns exterior geometry, texture generation, structural sealing, material refinement, export and rendering. `reference_interior.py` owns the bounded interior geometry. No runtime package dependency is added.

The generator writes genuine structural/final `.blend` sources, self-contained GLB, baseline, receipt and three native Blender Cycles 1280×960 WebP previews:

- `foodtruck-preview.webp`: transparent exterior serving-side/front view.
- `foodtruck-interior.webp`: rear looking toward kitchen and sleeping bay.
- `foodtruck-rear-interior.webp`: front looking toward rear kitchen and AC.

Preview wheels, cameras, lights and the opened-hatch pose are added only after both source files and the closed GLB are saved. They are not saved over the baseline or shipped as duplicate wheels. All preview images are actual Blender renders of the reconstruction, not reference photographs.

All geometry, hierarchy, transforms and UVs are sealed before material refinement; finalization must preserve the exact baseline digest. Legitimate articulated runtime poses are declared above and are not permission to resave modified geometry against the old baseline. Files are preserved in `assets/`, machine-readable evidence in `evidence/foodtruck/`, public GLB in `public/models/`, and previews in `public/images/`.

Independent loaded-source verification requires the digest handed off outside the polishing worker directory:

```bash
blender --background blender-mcp-pipeline/assets/foodtruck-final.blend \
  --disable-autoexec --python-exit-code 1 \
  --python blender-mcp-pipeline/verify_foodtruck.py -- \
  --baseline blender-mcp-pipeline/evidence/foodtruck/foodtruck-baseline.json \
  --expected-hash RECORDED_STRUCTURE_HASH
```

This asset's budget is ≤45,000 triangles and ≤1,500,000 bytes, explicitly expanded from the earlier concept to retain the observed interior, hatches, cab-over exterior and portable textures. Other atelier assets keep their original 20,000-triangle / 512,000-byte defaults. No Draco/KTX2 decoder, remote texture, font or CDN is required. The receipt records actual metrics rather than treating the budget as measured performance.

Full glTF validation uses `validate_foodtruck.mjs` and the separate tooling installation of `gltf-validator@2.0.0-dev.3.10` through `NODE_PATH`. Custom structural/budget checks, Khronos format validation, independent Blender reopen checks and render inspection are separate gates. Browser driving, clone-safe articulation, showroom rendering, device performance and deployment require their own app evidence and are not marked passed by the generator.

`check_foodtruck_source.py` additionally reopens the source between three deliberate negative cases: an opened stored hatch, a one-centimetre windshield edit and a removed wheel anchor. Each must be rejected; the script never saves the mutations. `publication-verification.json` checks that the published model, three previews, two sources, baseline and generator modules match the build receipt. It also records render-review limits and the harmless optional wood-tangent exporter warning; the normal-mapped checker plate exports explicit tangents and Khronos reports zero warnings.

## Fidelity limits

No surveyed dimensions, underbody photograph or mechanical drawings were supplied. Axle spacing, clearances, hidden cabinetry depth, bunk proportions, rear arrangements and opposite-side details use bounded visual estimates. Wheels are simplified application geometry; tyre tread, door seals, small screws, unreadable decals, control labels, cab seats and a complete engine/suspension are omitted. Wood grain and metal finish approximate appearance without claiming a real material specification. The floor plan must not be used to authorize vehicle modification, food-service operation or electrical installation.
