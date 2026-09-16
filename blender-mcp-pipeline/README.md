# Blender MCP pipeline

Export real 3D assets into this repo so Codex and Grok load the same files.

## Target files

| Asset | Blender object | Export path | Loaded in |
| --- | --- | --- | --- |
| Picture frame | `Frame_Work` | `public/models/work-frame.glb` | `atelier-world.tsx` WorkFrame |
| Monogram | `Monogram_SxB` | `public/models/monogram.glb` | `atelier-world.tsx` Monogram |
| Plinth | `Plinth` | `public/models/plinth.glb` | same |
| Zone pavilion | `Landmark_*` | `public/models/landmark-*.glb` | `src/drive/world/Landmarks.tsx` |

Y-up, +Z forward (Three.js). Scale 1 Blender unit = 1 metre. Origin at the object’s rest position.

## MCP session (Blender)

1. Open the atelier `.blend` (create `blender-mcp-pipeline/atelier.blend` if missing).
2. Via Blender MCP, create or refine `Frame_Work`: outer metal rim, inner picture plane named `Artwork` with a UV 0–1 rectangle.
3. Apply transforms (`Ctrl+A` location/rotation/scale).
4. Run `export_glb.py` (Text Editor → Run Script, or `blender -b atelier.blend -P blender-mcp-pipeline/export_glb.py`).
5. Commit the GLB. Do not commit `.blend1` backups.

## glTF export settings

- Format: **glTF Binary (.glb)**
- Transform: `+Y Up`
- Geometry: apply modifiers, UVs, normals
- Compression: Draco if the add-on is enabled
- Materials: Principled BSDF only (metalness/roughness). No image textures on the frame — the app maps `/works/*.jpg` onto the `Artwork` mesh at runtime.
- Don’t export lights or cameras.

## Wiring in R3F

```tsx
import { useGLTF } from "@react-three/drei";
import { useLayoutEffect } from "react";
import * as THREE from "three";

export function WorkFrameMesh({ map }: { map: THREE.Texture }) {
  const { scene } = useGLTF("/models/work-frame.glb");
  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      if (obj.name === "Artwork" && obj.material) {
        const mat = obj.material as THREE.MeshStandardMaterial;
        mat.map = map;
        mat.needsUpdate = true;
      }
    });
  }, [scene, map]);
  return <primitive object={scene} />;
}

useGLTF.preload("/models/work-frame.glb");
```

Keep a geometry fallback (the current box + plane) until the GLB exists, so Grok preview never goes blank.

## Naming

- Objects: PascalCase, unique, stable (`Frame_Work`, `Artwork`, `Monogram_SxB`)
- Materials: `Mat_Metal`, `Mat_Artwork`
- No spaces in names — MCP and Three.js both break on them
