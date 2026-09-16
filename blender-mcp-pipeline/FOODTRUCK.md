# S×B FOOD STUDIO — original mobile atelier concept

This is an original authored concept asset. No actual truck photos or measured dimensions were available to this build. It does not claim to reconstruct the user's vehicle, establish a licensed beverage franchise, set a real menu/price, or describe an operating business. The S×B identity is project-authored; no third-party marks, textures, fonts or 3D models are imported.

The low-poly static body is designed for the Drive gallery. The serving side has an actual open aperture, compact fixed visor, serving ledge, abstract menu panel, cabinets, generic appliance, shelf and canisters. The cab has sloping windows, inset doors, mirrors, trim, headlamps, a grille and rear doors. Material-only finalization uses ink, bone and silver, with ordinary functional red tail lamps.

## Runtime contract

- Root: `FoodTruck_Body`. Coordinates: metres, Y-up, front **−Z**.
- Root origin: axle/wheel-centre height. Runtime places tyre contact at ground by setting the visual origin to tyre radius above ground.
- Body design envelope: width 1.90 m, length 3.40 m, roof height 2.15 m relative to axle; mirrors, bumpers, serving ledge and roof vent extend beyond this envelope. Exact measured full bounds are in `evidence/foodtruck/foodtruck-receipt.json`.
- Wheel meshes are **not exported**. The app owns four animated wheels with radius 0.32 m and approximate tread width 0.22 m.

| Anchor | X | Y | Z |
| --- | ---: | ---: | ---: |
| `WheelAnchor_FL` | −0.95 | 0 | −1.12 |
| `WheelAnchor_FR` | +0.95 | 0 | −1.12 |
| `WheelAnchor_RL` | −0.95 | 0 | +1.00 |
| `WheelAnchor_RR` | +0.95 | 0 | +1.00 |

The four anchors are named empty nodes. Static body parts are joined by material role **before** locking geometry to reduce draw calls. `source_parts` extras preserve the original part names. The root, windshield, counter, branding, menu and lamp nodes remain identifiable.

If the app retains its dynamic day/night lamp meshes, remove `Lamp_Front_0`, `Lamp_Front_1`, `Lamp_Rear_0`, and `Lamp_Rear_1` from its cloned GLB. Front lamps are x ±0.655, y 0.645, z −1.701. Rear lamps are x ±0.655, y 0.60, z +1.705. Clone cached scenes before per-instance changes. Keep the authored geometry fallback if loading fails. Do not add a second wheel set to the GLB.

## Build and verify

Use the same verified official Blender 4.5 LTS toolchain as the atelier pipeline. Example (new output directory each run):

```bash
blender --background --factory-startup --disable-autoexec --python-exit-code 1 \
  --python blender-mcp-pipeline/build_foodtruck.py -- \
  --output-dir blender-mcp-pipeline/build/foodtruck-NEW
```

The generator writes real structural and final `.blend` sources, a GLB, a structure manifest, receipt and a transparent 1280×960 Blender Cycles WebP preview. Temporary wheels and lighting are used only for the preview; they are not saved into either source or exported GLB. The preview is a render of this concept, not a photograph.

All geometry is sealed before material refinement. Finalization changes material assignments only and verifies unchanged object hierarchy, transforms, topology, positions and UV data. Source/output/preview SHA-256 and the baseline digest are recorded in the receipt. The pure mesh export is self-contained; there are no remote textures or optional decoder requirements. Hard budgets are ≤20,000 triangles and ≤512,000 bytes; actual metrics appear in the receipt.

For independent source verification, give the verifier the digest recorded outside the polishing worker's directory:

```bash
blender --background blender-mcp-pipeline/assets/foodtruck-final.blend \
  --disable-autoexec --python-exit-code 1 \
  --python blender-mcp-pipeline/verify_foodtruck.py -- \
  --baseline blender-mcp-pipeline/evidence/foodtruck/foodtruck-baseline.json \
  --expected-hash RECORDED_STRUCTURE_HASH
```

Full glTF validation uses `validate_foodtruck.mjs` with the separately installed, pinned `gltf-validator@2.0.0-dev.3.10` exposed through `NODE_PATH`. This does not add a website dependency. Browser loading, actual drive handling, device GPU performance and deployment need their own app verification; source generation never marks them passed.
