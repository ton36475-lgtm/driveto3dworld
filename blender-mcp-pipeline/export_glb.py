"""Export atelier objects to public/models/*.glb

Run inside Blender:
  blender -b blender-mcp-pipeline/atelier.blend -P blender-mcp-pipeline/export_glb.py
"""

from pathlib import Path

import bpy

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "models"
OUT.mkdir(parents=True, exist_ok=True)

EXPORTS = {
    "Frame_Work": "work-frame.glb",
    "Monogram_SxB": "monogram.glb",
    "Plinth": "plinth.glb",
}


def export_object(name: str, filename: str) -> None:
    obj = bpy.data.objects.get(name)
    if obj is None:
        print(f"skip missing object: {name}")
        return
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    dest = OUT / filename
    bpy.ops.export_scene.gltf(
        filepath=str(dest),
        use_selection=True,
        export_format="GLB",
        export_yup=True,
        export_apply=True,
        export_cameras=False,
        export_lights=False,
    )
    print(f"wrote {dest}")


def main() -> None:
    for name, filename in EXPORTS.items():
        export_object(name, filename)


if __name__ == "__main__":
    main()
