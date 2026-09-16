# Independent source review — complete

Reviewed checkout: `/workspace/scratch/65529ea62875/repos/driveto3dworld`, branch `codex/agm-forge-production`, base `734cbb8e7fc3e89e251adbd7fd3b7f9eaf7ca46d` plus working-tree changes. Read `AGENTS.md`. Review is read-only for repository source. The lead agent declared source stable; final source inspection completed at `2026-09-16T07:04:03Z`.

**Status: COMPLETE_SOURCE_REVIEW. Production readiness: WITHHELD.** All four findings below are resolved in reviewed source. This permits review of the proposed branch, not production deployment or a claim that browser, mobile, Mac/MCP or remote CI gates have passed.

## Findings sent to the implementing agent

1. **P1 — RESOLVED: Missing inquiry validator import prevented persistence.** The intermediate `src/lib/ops/storage.ts:1,51` called `validateInquiry` without importing it. A direct Node 24 invocation of `writeStored` with any valid nonempty inquiry array threw `ReferenceError: validateInquiry is not defined`; the browser store caught this as a storage failure. The import is restored at line 4. Independently re-ran valid nonempty persistence successfully.

2. **P2 — RESOLVED: A valid saved workspace could export an unrestorable backup.** Intermediate `src/lib/ops/storage.ts` admitted compact persisted JSON up to 5 MiB but exported indented JSON with a larger envelope and used the same input limit on restore. With 511 valid inquiries, each carrying a 10,000-character ASCII message, the persisted envelope was 5,194,524 bytes and the backup 5,248,381 bytes, above the 5,242,880-byte limit. Data shape uses `id=test-{i}`, `at=1`, `name=Test Person`, `channel=email`, `handle=review@example.test`, `type=other`, `status=received`, `assignee=null`, plus standard seed drafts. Current code uses compact backup serialization and shared portable-size admission (`:114–131,173–175,193–198`). Independently ran write/export/restore: saved 5,194,524 bytes; backup 5,194,565 bytes; all 511 inquiries restored.

3. **P2 — RESOLVED: Evidence labels did not cover all portfolio surfaces.** Intermediate `src/drive/ui/ProjectModal.tsx` displayed original detail statements as facts: `src/drive/data/projects.ts:48` says a pavilion was commissioned, `:140` says a sculpture was made, scanned and retopologized; similarly unsupported precise asset metrics existed. The gallery selected-work panel displayed project year/location/excerpts without labels. Independently re-read fixes: Drive modal, catalog, start screen and static fallback use `src/drive/data/concepts.ts` labels and prospective design summaries; dimensions/mesh metrics show N/A. The modal no longer presents raw detail/year/process tags. The gallery popup now removes year/location/excerpt and displays `PortfolioEvidence` (`src/routes/gallery.tsx:125–147`).

4. **P2 — RESOLVED: Drive test path excluded the added tests.** The initial `package.json` test command used `src/drive/*.test.ts`, whereas all added drive tests are under `src/drive/systems/`. Latest read uses `src/drive/systems/*.test.ts`; final suite execution belongs to the lead agent.

No assigned-scope P1/P2 remains open at the latest source/reproduction check. This statement is not a full production acceptance or a browser-visual verdict.

## Scope observations

- New local operations and Forge code has no direct network delivery. Contact opens the owner-confirmed Facebook profile only on explicit user action and explains that the brief must be sent manually.
- Local operations accurately state that information belongs to the browser profile, is accessible to other users of that profile, and is not synchronized with the studio. Backup copy identifies contact details/messages as private.
- Portfolio profile routes distinguish Ball, Ton and shared projects. AGM appears only as a proposed initiative; sampled public source contains no attached PDF financial tables, identity copies or private artist data.
- Forge validation uses explicit enums, rejects extra configuration fields, leaves evidence proposed and analytics uninstrumented, and produces a local download.
- Runtime bootstrap locks installation, checks the lockfile/runtime, disables dependency install scripts, and does not run a downloaded installer. Existing-server reuse explicitly does not prove checkout identity. These checks are not remote host/MCP attestation.
- Auth/database support remains in inherited template source, but new product surfaces do not invoke it. Only opt-in nested auth migrations were present; no new shared database or send integration was added.
- Final source re-read found the previously missing PWA icon, CSS and three control SVGs now present. Template/environment tests use isolated fixtures or explicit skips for unavailable template documents. An earlier failing `tests-final.log` was stale; the lead agent owns the final rerun and must report skips separately.
- Frame GLB integration uses a local model URL, checks required rim names, clones the scene, keeps materials per frame and retains the app's image plane. Suspense/error paths keep procedural geometry available. This was source-inspected, not visually verified in a browser.
- The CI workflow runs locked bootstrap, tests/build/typecheck/lint, route probes and browser smoke; it does not merge, deploy, send messages or operate remote devices. New worker documentation explicitly separates local receipts from independent approval and remote host state.
- `git diff --check` passed at final inspection.

## Verification limits

This is source review plus targeted Node reproductions. No full browser, WebGL, mobile/touch, production parity, Mac mini, Blender application or MCP interaction has been independently verified by this reviewer. The lead agent owns build/test results and the Blender worker's evidence; neither is silently represented as this reviewer's execution.

Local storage read-before-write is not an atomic cross-tab transaction. Simultaneous edits in different browser tabs remain an unverified limitation; this review does not certify concurrent multi-operator persistence. Browser CI and actual owner-host/MCP verification remain required before overall production acceptance.

## Reviewed source fingerprints

These hashes bind the most relevant reviewed source files, not deployment state or every repository file.

| File | SHA-256 |
| --- | --- |
| `src/lib/ops/storage.ts` | `3e6ecbbc5ebd03111226b79cf0b02a79c4827917612c9165143d3f971bde4e30` |
| `src/lib/ops/store.ts` | `c503f929cacd945230ee3e87216d1a68aafd6f57fd88d07ff900010a03845531` |
| `src/lib/forge/config.mjs` | `6af547b28660aab995d24f57569b4634c2104b03ed0b5c6461d4fced8fab5e47` |
| `scripts/start-runtime.mjs` | `19144e9ad1f8a2518f1b812f3bba55358ae62720d21878677a0afcef06651cbd` |
| `src/drive/ui/ProjectModal.tsx` | `8d81e0453628a6b94c84ee17e55dcfeb4a49ab4777be3a9529d341bbc3f4bf9d` |
| `src/routes/gallery.tsx` | `ef44c2a0938b666ea127457cd808b4f059b01835142ffda0a8b40d0e00a88a8e` |
| `src/components/canvas/frame-asset.tsx` | `bd06f73aa4ea0468de3b9e87ae69cf25db50ae351f9e30bb0f7c621277b5a86f` |
