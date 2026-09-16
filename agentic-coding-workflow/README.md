# Agentic coding workflow

Shared source of truth: **[ton36475-lgtm/driveto3dworld](https://github.com/ton36475-lgtm/driveto3dworld)**

Two agents write the same app:

| Agent | Where it runs | What it owns |
| --- | --- | --- |
| **Grok App Builder** | Isolated preview sandbox | Live 3D site, UI, copy, deploy-to-preview |
| **Codex** | Local clone of this repo | Models, controls, Blender MCP, PRs |

They do **not** share a filesystem. GitHub is the only sync.

## Rules

1. `main` is always runnable (`npm install && npm run dev`).
2. Grok commits go on `grok/*` or directly to `main` for small product edits.
3. Codex commits go on `codex/<short-task>` and open a PR into `main`.
4. Do not rewrite history on `main`.
5. Do not commit `node_modules`, `.env`, `.grok/`, or secrets.
6. One task per PR. Keep the 3D gallery working after every merge.

## How to work (Codex)

```bash
git clone https://github.com/ton36475-lgtm/driveto3dworld.git
cd driveto3dworld
git checkout -b codex/glb-frames
npm install
npm run dev
```

Then paste [CODEX_PROMPT.md](./CODEX_PROMPT.md) into Codex.

When done:

```bash
git add -A
git commit -m "feat: load GLB work frames from Blender export"
git push -u origin HEAD
# open a PR into main
```

## How to work (Grok)

Grok already has this workspace. After product edits, push the same files to this repo so Codex sees them. Never delete `startup.sh` in the sandbox.

## Layout

```
src/                         # salon app (TanStack Start + R3F)
src/drive/                   # WASD grounds, four zones, twelve studies
public/works/                # photography used as 3D frame textures
public/audio/                # drive engine / wind / collect / zones
public/models/               # GLB from Blender MCP (Codex fills this)
agentic-coding-workflow/     # this protocol
blender-mcp-pipeline/        # Blender → glTF → R3F
```
