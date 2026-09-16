# Atelier model assets

`work-frame.glb`, `monogram.glb`, and `plinth.glb` are produced by the repository's deterministic Blender pipeline. `manifest.json`, when present, records their actual hashes, bounds, triangle counts and provenance.

Run `python3 blender-mcp-pipeline/run_pipeline.py doctor` before building. See [pipeline instructions](../../blender-mcp-pipeline/README.md) for generation, validation, safe publishing and the per-asset coordinate contract.

The application must retain procedural geometry when a model is pending, missing or fails to load. GLB presence alone does not prove browser integration. Artwork images remain app data; no provider-generated or downloaded third-party 3D assets are required.

Earlier placeholder names (`arch.glb`, `char.glb`, `veh.glb`, `prod.glb`) have no generated assets or established loader contract and are not represented as completed exports.
