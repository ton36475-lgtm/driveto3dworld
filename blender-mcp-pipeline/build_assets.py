"""Deterministic atelier props, measured baseline, material-only polish, GLB export."""
import argparse
import json
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import bpy
from contract import digest, file_digest, lock_structure, safe_output_directory, verify_structure
from export_glb import export_assets


def write_json(path, value):
    path.write_text(json.dumps(value, indent=2, allow_nan=False) + "\n")


def xyz(point):
    """Project contract uses glTF Y-up/+Z front; Blender uses Z-up/-Y front."""
    x, y, z = point
    return (x, -z, y)


def material(name, color, metalness, roughness):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metalness
    bsdf.inputs["Roughness"].default_value = roughness
    return mat


def root(name):
    obj = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(obj)
    obj["asset_contract"] = "atelier-v1"
    return obj


def mesh(name, vertices, faces, parent, mat):
    data = bpy.data.meshes.new(name + "_Geometry")
    data.from_pydata([xyz(p) for p in vertices], [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    bpy.context.scene.collection.objects.link(obj)
    obj.parent = parent
    obj.data.materials.append(mat)
    return obj


def box(name, center, size, parent, mat):
    cx, cy, cz = center
    w, h, d = (v / 2 for v in size)
    vertices = [(cx+x*w, cy+y*h, cz+z*d) for x,y,z in
                [(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)]]
    return mesh(name, vertices, [(0,3,2,1),(4,5,6,7),(0,1,5,4),(3,7,6,2),(0,4,7,3),(1,2,6,5)], parent, mat)


def ring_mesh(name, lower_radius, upper_radius, bottom, top, parent, mat, segments=48):
    verts = [(radius*math.cos(i*math.tau/segments), height, radius*math.sin(i*math.tau/segments))
             for radius,height in [(lower_radius,bottom),(upper_radius,top)] for i in range(segments)]
    faces = [(i,(i+1)%segments,(i+1)%segments+segments,i+segments) for i in range(segments)]
    faces += [tuple(reversed(range(segments))), tuple(range(segments,2*segments))]
    return mesh(name, verts, faces, parent, mat)


def stroke(name, points, parent, mat, radius=0.018):
    curve = bpy.data.curves.new(name + "_Curve", "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = radius
    curve.bevel_resolution = 2
    curve.resolution_u = 1
    curve.use_fill_caps = True
    spline = curve.splines.new("POLY")
    spline.points.add(len(points)-1)
    for point, target in zip(points, spline.points):
        target.co = (*xyz(point), 1)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.scene.collection.objects.link(obj)
    obj.parent = parent
    obj.data.materials.append(mat)
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target="MESH")


def build_geometry():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.context.scene.unit_settings.system = "METRIC"
    bpy.context.scene.unit_settings.scale_length = 1.0
    bpy.context.preferences.filepaths.save_version = 0
    neutral = material("Mat_Structure", (0.35,0.35,0.35), 0, 0.7)
    frame = root("Frame_Work")
    width, height, t = 1.94, 1.40, 0.055
    box("Frame_Backplate", (0,0,-0.06), (1.98,1.44,0.05), frame, neutral)
    for name, center, size in [
        ("Frame_Top", (0,height/2-t/2,0), (width,t,0.09)),
        ("Frame_Bottom", (0,-height/2+t/2,0), (width,t,0.09)),
        ("Frame_Left", (-width/2+t/2,0,0), (t,height-2*t,0.09)),
        ("Frame_Right", (width/2-t/2,0,0), (t,height-2*t,0.09)),
    ]:
        box(name, center, size, frame, neutral)
    artwork = mesh("Artwork", [(-0.89,-0.62,0.012),(0.89,-0.62,0.012),(0.89,0.62,0.012),(-0.89,0.62,0.012)], [(0,1,2,3)], frame, neutral)
    uv = artwork.data.uv_layers.new(name="UVMap")
    for loop, coord in zip(uv.data, [(0,0),(1,0),(1,1),(0,1)]):
        loop.uv = coord
    monogram = root("Monogram_SxB")
    # Original geometric strokes, no external font or third-party artwork.
    stroke("Letter_S", [(-0.26,0.15,0),(-0.45,0.15,0),(-0.49,0.10,0),(-0.49,0.04,0),(-0.45,0,0),(-0.30,0,0),(-0.26,-0.04,0),(-0.26,-0.10,0),(-0.30,-0.15,0),(-0.49,-0.15,0)], monogram, neutral)
    stroke("Multiply_A", [(-0.07,-0.09,0),(0.07,0.09,0)], monogram, neutral, 0.012)
    stroke("Multiply_B", [(-0.07,0.09,0),(0.07,-0.09,0)], monogram, neutral, 0.012)
    stroke("Letter_B_Spine", [(0.26,-0.15,0),(0.26,0.15,0)], monogram, neutral)
    stroke("Letter_B_Bow", [(0.26,0.15,0),(0.44,0.15,0),(0.49,0.11,0),(0.49,0.05,0),(0.44,0,0),(0.26,0,0),(0.44,0,0),(0.49,-0.05,0),(0.49,-0.11,0),(0.44,-0.15,0),(0.26,-0.15,0)], monogram, neutral)
    plinth = root("Plinth")
    ring_mesh("Plinth_Base", 0.7, 0.58, 0, 0.42, plinth, neutral)
    ring_mesh("Plinth_Crown", 0.56, 0.56, 0.42, 0.432, plinth, neutral)
    bpy.context.view_layer.update()


def snapshot():
    bpy.context.view_layer.update()
    objects = {}
    for obj in bpy.context.scene.objects:
        if obj.modifiers or obj.constraints or obj.animation_data:
            raise ValueError(f"Unbaked modifier/constraint/animation: {obj.name}")
        record = {"type": obj.type, "parent": obj.parent.name if obj.parent else None,
                  "matrixWorld": [[round(float(v),9) for v in row] for row in obj.matrix_world],
                  "dimensions": [round(float(v),9) for v in obj.dimensions]}
        if obj.type == "MESH":
            if obj.data.shape_keys:
                raise ValueError(f"Unbaked shape keys: {obj.name}")
            record["geometryHash"] = digest({
                "vertices": [[float(v) for v in vertex.co] for vertex in obj.data.vertices],
                "faces": [list(poly.vertices) for poly in obj.data.polygons],
                "uv": [[float(v) for v in loop.uv] for layer in obj.data.uv_layers for loop in layer.data],
            })
        objects[obj.name] = record
    return objects


def polish():
    metal = material("Mat_Metal", (0.56,0.61,0.67), 0.88, 0.24)
    dark = material("Mat_Plinth", (0.009,0.009,0.011), 0.5, 0.38)
    back = material("Mat_Backplate", (0.005,0.005,0.006), 0.35, 0.60)
    art = material("Mat_Artwork", (0.82,0.79,0.74), 0.06, 0.7)
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        selected = art if obj.name == "Artwork" else back if obj.name == "Frame_Backplate" else dark if obj.name == "Plinth_Base" else metal
        obj.data.materials.clear()
        obj.data.materials.append(selected)


def main(output_dir):
    out = safe_output_directory(output_dir)
    build_geometry()
    baseline = lock_structure(snapshot())
    write_json(out / "structural-baseline.json", baseline)
    bpy.ops.wm.save_as_mainfile(filepath=str(out / "atelier-structural.blend"))
    structural_hash = file_digest(out / "atelier-structural.blend")
    polish()
    validation = verify_structure(baseline, snapshot())
    bpy.ops.wm.save_as_mainfile(filepath=str(out / "atelier-final.blend"))
    receipts = export_assets(out / "models")
    write_json(out / "build-receipt.json", {
        "schemaVersion": 1, "status": "PASS", "blenderVersion": bpy.app.version_string,
        "source": "Original procedural code; dimensions match repository frame geometry",
        "geometryAuthority": "atelier-contract-v1 (not a supplied architectural floor plan)",
        "provider": None, "externalAssets": [], "coordinateSystem": "metres, GLB Y-up, +Z front",
        "structuralSourceSha256": structural_hash,
        "finalSourceSha256": file_digest(out / "atelier-final.blend"),
        "baselineSha256": file_digest(out / "structural-baseline.json"),
        "generatorSha256": file_digest(__file__), "structureValidation": validation, "assets": receipts,
        "browserValidation": "NOT_RUN_BY_GENERATOR", "humanVisualApproval": "NOT_CLAIMED",
    })
    print(f"ATELIER_BUILD_PASS {out}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args(sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else [])
    main(args.output_dir)
