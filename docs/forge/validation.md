# Verification status — 2026-09-16

- Clean locked dependency install: PASS, lifecycle scripts disabled.
- Dependency audit: npm reports 0 known vulnerabilities at this snapshot. Limited known-secret-pattern source scan: 0 matching files; not a certification.
- Build, TypeScript and ESLint: PASS.
- Existing and new Node test suites: 291 passed, 0 failed, 4 skipped (295 total); 4 optional host-template document tests are explicitly skipped because those non-versioned instruction files are absent. No runtime behavior test is counted as passed when skipped.
- Same-invocation local HTTP/SSR: all 13 routes returned HTTP200 with expected app HTML (/, /gallery, /drive, /studio, /contact, /forge, /desk, /marketing, /automations, /kit, /people/ball, /people/ton, /people/studio). This does not establish client rendering.
- Blender4.5.14 LTS: 16 Python tests passed; actual structural lock, export, missing-object rejection and moved-object rejection passed. Three GLBs have 0 validator errors and0 warnings. Source .blend files and rendered preview are retained.
- Independent source review: completed; four findings corrected and rechecked. See evidence/independent-review.md for scope.
- Local browser QA: BLOCKED; selected cloud browser cannot access this execution network. Existing live site was observed separately and is not this branch. CI includes four widths, route smoke and production baseline checks; its results are separate evidence.
- Real Android/iOS/Mac GPU, Mac mini runtime, Blender MCP Studio, 9Router, Hermes, external delivery and deployment: NOT VERIFIED.

## Known limits

Operations are local to one browser profile. Read-before-write retains sequential tab updates but does not implement an atomic multi-tab transaction. Background reminders require the page to be open. No shared staff backend or automatic publisher is connected. Metrics are N/A. Concepts remain unverified; actual venue dimensions were not supplied.

An SHA-256 receipt detects changes against a separately retained digest; it is not a digital signature or proof of authorship. Overall production readiness remains WITHHELD until required browser and owner-host evidence exists.

## Remote CI follow-up

Initial run 35067058364 exposed a missing optional peer in npm10 and ambient auth variables leaking into unit tests. Both were reproduced and repaired. Isolated clean installs passed on Node22/npm10 and Node24/npm11. Repository auth-off defaults now apply in a fresh clone without ignored local files; explicit owner/provider environment values still win. Production-browser operations and spatial/configuration interaction checks were added for the next CI run. Their execution result remains pending until a completed workflow is recorded.

Run 35067998457 passed install/unit/build/type/lint/13-route HTTP on both Node versions. Home/gallery/drive navigation checks passed, but artifacts showed some loading states captured too early. Forge exposed screenshot-injected caret inline styles during delayed hydration. The next revision retains strict errors, waits for route hydration and first-frame/permanent-fallback markers, and preserves caret styles. Mobile home copy now occupies its own space below the scene to avoid overlapping fallback cards. Production-browser checks continue independently after dev smoke so one failure cannot hide other scenario results.
