# Verified Blender asset pipeline

This pipeline builds the atelier's original procedural frame, geometric S × B monogram, and plinth. Dimensions come from the existing app. No floor-plan image was supplied; these assets are not a measured reconstruction of a real hotel or resort.

The build has two deterministic stages: geometry and material-only polish. It records all object transforms, hierarchy, mesh topology, vertex positions, and UV data before polish. Any structural change causes failure. The baseline is a machine-validated contract, not a claim of user visual approval.

## Requirements and repeatable execution

- Python 3.11 or newer for the small runner and tests. No pip dependencies.
- Official Blender 4.5 LTS. Set `BLENDER_BIN` to an absolute executable path when it is not in PATH; macOS also checks `/Applications/Blender.app/Contents/MacOS/Blender`.
- Run the preflight before a build. Install a pinned Blender once; do not download or reinstall it on every web-app startup.

```bash
python3 blender-mcp-pipeline/run_pipeline.py doctor
python3 -m unittest discover -s blender-mcp-pipeline -p 'test_*.py' -v
python3 blender-mcp-pipeline/run_pipeline.py build --output-dir blender-mcp-pipeline/build/worker-01-run-001
python3 blender-mcp-pipeline/run_pipeline.py verify blender-mcp-pipeline/build/worker-01-run-001
python3 blender-mcp-pipeline/run_pipeline.py publish blender-mcp-pipeline/build/worker-01-run-001
```

Output directories must be new. An atomic directory creation prevents two workers claiming the same output, including an empty existing directory. Existing sources are never overwritten. The runner uses argument arrays and Blender background execution with `--disable-autoexec` and `--python-exit-code 1`; a Python error produces a failing process status. Python build scripts intentionally supplied by this project still run. A failed preflight leaves app geometry fallback usable.

`publish` checks source files and GLBs against their receipt before writing to `public/models`. It uses an exclusive publisher lock and atomic per-file replacement, publishing the manifest last. It is not an atomic multi-file deployment mechanism; commit/deploy the full validated set as one app revision. Do not manually delete another live publisher's lock.

## Asset contract

All GLBs use metres, Y-up and +Z forward; roots are at identity. No Draco/KTX2 decoder, CDN, texture, font, camera or light is required.

| GLB | Root | Geometry contract | Origin |
| --- | --- | --- | --- |
| `work-frame.glb` | `Frame_Work` | rim 1.94 × 1.40 m; backplate 1.98 × 1.44 m; bounds z −0.085 to +0.045 m | artwork centre at x/y 0 |
| `monogram.glb` | `Monogram_SxB` | original 3D stroke lettering, measured 1.013971 × 0.336 × 0.036 m | lettering centre |
| `plinth.glb` | `Plinth` | base diameter 1.40 m; height 0.432 m including crown | ground centre |

Frame mesh children: `Frame_Backplate`, `Frame_Top`, `Frame_Bottom`, `Frame_Left`, `Frame_Right`, `Artwork`. `Artwork` is 1.78 × 1.24 m at local z=0.012 with a UV rectangle from 0 to 1.

The web app owns each work's actual image, interaction and caption. When replacing frame geometry, hide/remove the exported `Artwork` mesh and retain the app's image plane; alternatively clone its material before assigning each texture. Clone the cached scene for every frame, and never mutate a shared loaded material for per-work hover state. Keep a procedural fallback for both pending and failed loading. Assets being present does not imply all three have been integrated.

## Generated evidence

Each run creates:

- `atelier-structural.blend` and `atelier-final.blend`: editable source files in the private build directory.
- `structural-baseline.json`: stable structure digest and every object record.
- `models/*.glb` and `models/asset-validation.json`: actual exports and measured checks.
- `build-receipt.json`: Blender version, source/output hashes and material-pass verification.

The checked generation's two source `.blend` files are preserved in `assets/`, with matching receipts and baseline in `evidence/`. These source files are not served from the public website. `evidence/gltf-validation.json` records a separate full Khronos validator run: all three GLBs passed with zero errors and zero warnings. `evidence/negative-integration.json` records actual Blender rejection of missing roots and a moved plinth.

To repeat full glTF validation without adding a website dependency, install `gltf-validator@2.0.0-dev.3.10` in a separate tooling directory and set `NODE_PATH` to that directory's `node_modules`:

```bash
node blender-mcp-pipeline/validate_gltf.mjs public/models validation-report.json
```

`render_preview.py` can produce a separate visual preview from a loaded source; it rearranges objects only in memory and never saves over the structural or final source.

The custom GLB inspector checks header/chunks, required names, embedded buffers, accessor bounds and budgets (512 kB / 20,000 triangles per asset). It is explicitly not full glTF specification validation. Browser rendering, real-device performance, human visual approval and deployment are separate evidence stages; the generator never marks them passed.

The old exporter silently skipped missing objects and could export a parent without children. The replacement fails before output when required objects are absent and includes complete asset hierarchies. It only writes to a newly named output directory.

## Independent polish verification

For an externally edited final source, retain the originally recorded hash outside that worker's directory:

```bash
blender --background atelier-final.blend --disable-autoexec --python-exit-code 1 \
  --python blender-mcp-pipeline/verify_scene.py -- \
  --baseline structural-baseline.json --expected-hash RECORDED_STRUCTURE_HASH
```

Do not regenerate a baseline merely to make a changed scene pass. Geometry changes need a new structural revision and review. See [WORKERS.md](WORKERS.md) and [PROMPTS.md](PROMPTS.md) for worker handoffs and original instructions.

## Research and adapter choice

The implementation follows the two-stage idea in [Dev with Bebz workshop 02](https://github.com/sphakanin/dwb-workshop-prompts/tree/a29bbb970b2f8040e23fbc4067ff50adddb9f2a0/workshops/02-blender-sol-astra-mcp), using original code and original prompts. The reference is teaching material without a repository LICENSE; its full prompts are not vendored here. It contains neither MCP Studio nor an installer.

This background workflow requires command access, not an interactive Blender addon. For separately configured interactive sessions, the [MCP for Blender upstream](https://github.com/ahujasid/mcp-for-blender/tree/68e8b99f0e8d95284ea4dcc61002006f85ad5089) is a third-party MIT adapter, formerly `blender-mcp`. Keep its unauthenticated addon socket on localhost; use distinct ports per Blender instance. No tunnel or Mac mini configuration is changed by these scripts.

Using a cheaper capable model for structural work is a routing choice. Cost savings depend on actual model usage, rework and subscription limits; no unlimited/free-usage claim is made.

## Reference-informed foodtruck

The separate [foodtruck pipeline](FOODTRUCK.md) reconstructs the visible exterior and interior from six supplied truck images, preserves independent structural/final sources, and renders three actual Blender previews. Wheels, day/night lamps and clone-local opening hatches remain runtime responsibilities. Dimensions are inferred from appearance, not surveyed measurements. Its expanded 45,000-triangle / 1.5 MB budget is explicit; atelier asset defaults remain unchanged.
