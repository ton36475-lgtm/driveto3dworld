"""Fail-closed Blender exporter. Export to a new staging directory, never silently skip.

  blender -b atelier-final.blend --python-exit-code 1 -P export_glb.py -- --output-dir NEW_DIR
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from contract import EXPORTS, inspect_glb, require_objects, safe_output_directory


def export_assets(out):
    import bpy
    require_objects(bpy.context.scene.objects.keys())
    # Check every root before any write. Children must be exported too.
    selected_sets = {}
    for name in EXPORTS:
        root = bpy.data.objects[name]
        if root.parent is not None:
            raise ValueError(f"Export root must have no parent: {name}")
        selected_sets[name] = [root, *root.children_recursive]
        if not any(obj.type == "MESH" for obj in selected_sets[name]):
            raise ValueError(f"Export has no mesh: {name}")
    if bpy.data.objects["Artwork"] not in selected_sets["Frame_Work"]:
        raise ValueError("Artwork must be a child of Frame_Work")
    out = safe_output_directory(out)
    receipts = []
    for name, filename in EXPORTS.items():
        bpy.ops.object.select_all(action="DESELECT")
        for obj in selected_sets[name]:
            obj.hide_set(False)
            obj.select_set(True)
        bpy.context.view_layer.objects.active = bpy.data.objects[name]
        result = bpy.ops.export_scene.gltf(
            filepath=str(out / filename), use_selection=True, export_format="GLB",
            export_yup=True, export_apply=True, export_cameras=False, export_lights=False,
            export_animations=False, export_extras=True,
        )
        if "FINISHED" not in result:
            raise RuntimeError(f"Export failed: {name}")
        receipts.append(inspect_glb(out / filename, name))
    (out / "asset-validation.json").write_text(json.dumps({"status": "PASS", "assets": receipts}, indent=2) + "\n")
    return receipts


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args(sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else [])
    export_assets(args.output_dir)
