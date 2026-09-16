Paste this into Codex after cloning `ton36475-lgtm/driveto3dworld`.

You are continuing **SIRAWAT × BALL**, a bilingual (EN/TH) 3D creative atelier.

Stack: TanStack Start + React 19 + Tailwind v4 + Three.js via `@react-three/fiber` + `@react-three/drei`.

Two rooms:

- Salon: `src/components/canvas/atelier-world.tsx`, `hero-scene.tsx`, `/gallery`
- Grounds: `src/drive/` — WASD car, four zones, twelve collectible studies. **A turns left, D turns right.**

Work data: `src/lib/works.ts` (salon) and `src/drive/data/projects.ts` (grounds).

Do this next, in order:

1. **GLB frames** — replace box/plane frames with a Blender-exported picture-frame GLB via `useGLTF`. Put files in `public/models/` following `blender-mcp-pipeline/README.md`. Keep click/hover and drag-vs-click.
2. **Drive landmarks** — optional GLB props for zone pavilions; keep geometry fallbacks.
3. **Perf** — keep draw calls low; mobile (`quality === "low"`) must stay at 1x DPR, no extra lights/shadows.
4. **`npm run build` and `npm run typecheck` must pass.**
5. Drive controls self-test: `window.__controlsTest` already exists. Do not invert A/D.

Do not add auth, a database, or a backend. Do not remove EN/TH copy. Do not use purple/gold UI accents. Open a PR from `codex/<task>` into `main`.