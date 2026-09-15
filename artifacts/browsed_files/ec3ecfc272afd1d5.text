# MASTER PROMPT — 3D Portfolio Drive (Codex continuation, one block)

You are Codex continuing the Vite + React + Three.js 3D portfolio project on branch `codex/full-systems` of repo `ton36475-lgtm/3d-portfolio-codex`.

## Goal
A drivable car in a 200x200 unit world with 4 zones (architecture, characters, vehicles, products). Hidden glowing crystals collect projects from `src/data/projects.json`. On collect, open a modal with project details. No backend. Target 60 FPS on mid-range phones. Deploy static to Netlify/Vercel.

## Stack (already in package.json)
- Vite + React 18 + Three.js 0.169 via @react-three/fiber 8 + @react-three/drei 9
- @react-three/rapier 1.4 (physics)
- howler 2.2 (audio)
- Systems scaffolded under `src/systems/`: AudioManager.js, InputManager.js, Performance.js, DayNight.js
- Components: Car.jsx, World.jsx, HUD.jsx, ProjectModal.jsx
- Data: src/data/projects.js + projects.json
- Configs: netlify.toml, vercel.json, vite.config.js

## Current state (read these files first)
- src/App.jsx — scene root, canvas, systems wiring
- src/components/Car.jsx — placeholder car + basic movement
- src/components/World.jsx — ground + zone markers
- src/components/HUD.jsx — FPS + mute button
- src/components/ProjectModal.jsx — project card modal
- src/systems/AudioManager.js — Howler engine/wind/zone/collect, mute toggle
- src/systems/InputManager.js — WASD/arrows, touch joystick, gamepad
- src/systems/Performance.js — FPS monitor, pixel ratio, LOD distances
- src/systems/DayNight.js — sun + ambient cycle
- src/data/projects.json — 4 sample projects with zone + coords

## Tasks (do in order, commit after each major step)
1. **Audio assets**: create/replace placeholder files in `/public/audio` with real short loops (engine hum, wind, 4 zone beds, collect chime). Keep each under 200KB. Wire AudioManager to load them.
2. **3D models**: add real `.glb` models in `/public/models` (arch, char, veh, prod). Load with `useGLTF` + Draco. Add fallback boxes if missing. Place one per zone.
3. **Vehicle physics**: implement proper Rapier vehicle controller or kinematic car with wheel colliders. Camera follows behind car with smooth lerp. WASD/arrows/touch/gamepad all drive it.
4. **Particles**: collectible sparkle on crystals; optional rain/snow in zones.
5. **Performance**: texture atlases, instanced meshes for repeated props, Draco compression, target 60fps on mid phones. Use Performance.js LOD distances.
6. **Polish**: day/night affects lighting + fog; zone enter/exit sound crossfade; HUD shows FPS + mute; crystals glow + pulse.
7. **Build**: ensure `npm run build` passes with zero errors. Fix any import/path issues.
8. **Docs**: update README with run instructions, architecture diagram (mermaid), controls, and deploy notes.

## Constraints
- No backend, no database. All data in JSON/JS.
- Keep code clean, modular, commented. Match existing file style.
- Do not break existing systems; extend them.
- Commit to branch `codex/full-systems` with clear messages.
- Reply with full files or unified diffs for every change.

## Done when
- `npm run build` succeeds
- Car drives in all 4 zones, collects crystals, opens modal
- Audio + particles + day/night working
- README updated
- All changes committed to `codex/full-systems`

Start now. Read the files, then begin with task 1.