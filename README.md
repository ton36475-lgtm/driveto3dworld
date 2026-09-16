# SIRAWAT × BALL — driveto3dworld

Bilingual (EN/TH) creative atelier. Two ways into the work:

- **3D salon** — orbit the octagonal room, click a frame, open the case study
- **The grounds** — drive WASD through four zones and collect twelve studies

**GitHub (Grok + Codex share this):** [ton36475-lgtm/driveto3dworld](https://github.com/ton36475-lgtm/driveto3dworld)

This repo is the single source of truth. It folds in the salon from `3d-portfolio-production`, the original drive world, [agentic-coding-workflow](./agentic-coding-workflow), and [blender-mcp-pipeline](./blender-mcp-pipeline).

## Run

```bash
npm install
npm run dev
```

## Stack

- TanStack Start + React 19 + Tailwind v4
- Three.js · React Three Fiber · drei
- No auth, no database

## For Codex

1. Read [AGENTS.md](./AGENTS.md) in this repo
2. Paste [agentic-coding-workflow/CODEX_PROMPT.md](agentic-coding-workflow/CODEX_PROMPT.md) into Codex
3. Export models with [blender-mcp-pipeline/README.md](blender-mcp-pipeline/README.md)


## Reviewed production-hardening branch

Start with [the product contract](docs/forge/product-contract.md), [source reconciliation](docs/forge/source-reconciliation.md), and [runtime setup](docs/runtime.md). This branch adds local operations, separate personal profiles, configurable `/forge`, robust spatial fallbacks, and a guarded Blender asset pipeline. Live delivery, remote MCP connections and public deployment are separate capabilities; local saves and sample studies are labeled explicitly.

Run `npm run bootstrap`, `npm run doctor`, `npm test`, `npm run build`, `npm run typecheck`, and `npm run lint`. Use `node scripts/validate_template.mjs templates/creative-studio.v1.json` to validate an exported preset. See the runtime documentation for startup and CI evidence.
