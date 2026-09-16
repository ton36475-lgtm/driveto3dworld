# AGENTS.md — SIRAWAT × BALL

This file is for **Codex** (and any clone of the GitHub repo).

Product: bilingual 3D creative atelier. Dark ink / bone / cool silver. No purple, no gold, no emoji in UI.

Two 3D rooms, one studio:

| Room | Path | What it is |
| --- | --- | --- |
| Salon | `/` `/gallery` | Orbit the octagonal gallery, click a frame |
| Grounds | `/drive` | Drive WASD through four zones, collect studies |

## Stack

TanStack Start, React 19, Tailwind v4, Three.js, `@react-three/fiber`, `@react-three/drei`. Auth and database stay **off**.

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Where to edit

| Surface | Path |
| --- | --- |
| 3D salon | `src/components/canvas/atelier-world.tsx` |
| Canvas / orbit | `src/components/canvas/hero-scene.tsx` |
| Gallery page | `src/routes/gallery.tsx` |
| Drive world | `src/drive/` |
| Drive car / steer | `src/drive/world/Car.tsx` `src/drive/systems/input.ts` |
| Work data (salon) | `src/lib/works.ts` |
| Drive studies | `src/drive/data/projects.ts` |
| EN/TH copy | `src/lib/copy.ts` `src/drive/data/i18n.ts` |
| GLB pipeline | `blender-mcp-pipeline/` |
| Agent protocol | `agentic-coding-workflow/` |

## Hard rules

- Keep EN and TH in sync when you change copy.
- Keep a geometry fallback until a GLB exists — never blank the WebGL canvas.
- Drive: **A turns left / D turns right** under the chase camera. Do not invert.
- Branch as `codex/<task>`, PR into `main`.
- Do not add accounts, Postgres, or Grok-only platform hacks unless the sandbox already has them.

Full next-task list: `agentic-coding-workflow/CODEX_PROMPT.md`.
