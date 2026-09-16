"""Dependency-free structural lock and project-specific GLB inspection.

These checks are not a replacement for the full Khronos glTF Validator.
"""
import hashlib
import json
import math
import struct
from pathlib import Path

EXPORTS = {"Frame_Work": "work-frame.glb", "Monogram_SxB": "monogram.glb", "Plinth": "plinth.glb"}
REQUIRED_OBJECTS = frozenset((*EXPORTS, "Artwork"))
MAX_ASSET_BYTES = 512_000
MAX_ASSET_TRIANGLES = 20_000


def canonical_bytes(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"), allow_nan=False).encode()


def digest(value):
    return hashlib.sha256(canonical_bytes(value)).hexdigest()


def file_digest(path):
    with Path(path).open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def require_objects(names):
    missing = sorted(REQUIRED_OBJECTS - set(names))
    if missing:
        raise ValueError("Missing required objects: " + ", ".join(missing))


def lock_structure(objects):
    """Seal every object, including hierarchy and mesh digest; exclude materials."""
    require_objects(objects)
    if any(not obj.get("geometryHash") and obj.get("type") == "MESH" for obj in objects.values()):
        raise ValueError("Mesh objects require a geometry hash")
    return {"schemaVersion": 1, "objects": objects, "structureHash": digest(objects)}


def verify_structure(baseline, current):
    if baseline.get("schemaVersion") != 1:
        raise ValueError("Unsupported structural baseline")
    if baseline.get("structureHash") != digest(baseline.get("objects")):
        raise ValueError("Baseline digest mismatch")
    require_objects(current)
    old = baseline["objects"]
    changed = sorted(name for name in set(old) | set(current) if old.get(name) != current.get(name))
    if changed:
        raise ValueError("Locked structure changed: " + ", ".join(changed))
    return {"status": "PASS", "structureHash": baseline["structureHash"], "objectsCompared": len(old)}


def safe_output_directory(path):
    out = Path(path).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    try:
        out.mkdir()
    except FileExistsError as error:
        raise ValueError(f"Output directory must be new; it is already owned: {out}") from error
    return out


def inspect_glb(path, root_name, *, max_asset_bytes=MAX_ASSET_BYTES, max_asset_triangles=MAX_ASSET_TRIANGLES):
    """Check header, embedded buffers, required names, budgets and accessor bounds."""
    path = Path(path)
    data = path.read_bytes()
    if len(data) < 20 or len(data) > max_asset_bytes:
        raise ValueError("GLB missing/truncated or exceeds size budget")
    magic, version, length = struct.unpack_from("<4sII", data)
    if magic != b"glTF" or version != 2 or length != len(data):
        raise ValueError("Invalid GLB header")
    offset, chunks = 12, []
    while offset < len(data):
        if offset + 8 > len(data):
            raise ValueError("Truncated GLB chunk header")
        size, kind = struct.unpack_from("<I4s", data, offset)
        if size % 4 or offset + 8 + size > len(data):
            raise ValueError("Invalid GLB chunk length")
        chunks.append((kind, data[offset + 8:offset + 8 + size]))
        offset += 8 + size
    if len(chunks) != 2 or chunks[0][0] != b"JSON" or chunks[1][0] != b"BIN\x00":
        raise ValueError("Expected one JSON chunk and one binary chunk")
    document = json.loads(chunks[0][1])
    if document.get("asset", {}).get("version") != "2.0":
        raise ValueError("Expected glTF 2.0")
    if document.get("extensionsRequired"):
        raise ValueError("Runtime assets must not require optional decoders")
    nodes = document.get("nodes", [])
    names = [node.get("name") for node in nodes]
    if root_name not in names or (root_name == "Frame_Work" and "Artwork" not in names):
        raise ValueError("Export omitted required asset nodes")
    if len(names) != len(set(names)):
        raise ValueError("Duplicate node identity")
    scenes = document.get("scenes", [])
    scene_index = document.get("scene", 0)
    if scene_index >= len(scenes) or not scenes[scene_index].get("nodes"):
        raise ValueError("Asset has no active scene roots")
    buffers = document.get("buffers", [])
    if len(buffers) != 1 or "uri" in buffers[0] or not 0 < buffers[0].get("byteLength", 0) <= len(chunks[1][1]):
        raise ValueError("Expected one embedded nonempty buffer")
    for view in document.get("bufferViews", []):
        if view.get("buffer") != 0 or view.get("byteOffset", 0) < 0 or view.get("byteLength", 0) <= 0:
            raise ValueError("Invalid buffer view")
        if view.get("byteOffset", 0) + view["byteLength"] > buffers[0]["byteLength"]:
            raise ValueError("Buffer view exceeds binary data")
    triangles, bounds = 0, []
    accessors = document.get("accessors", [])
    for mesh in document.get("meshes", []):
        for primitive in mesh.get("primitives", []):
            if primitive.get("mode", 4) != 4:
                raise ValueError("Expected triangulated meshes")
            try:
                position = accessors[primitive["attributes"]["POSITION"]]
                indices = accessors[primitive["indices"]]
            except (KeyError, IndexError) as error:
                raise ValueError("Invalid primitive accessor") from error
            low, high = position.get("min", []), position.get("max", [])
            if len(low) != 3 or len(high) != 3 or not all(math.isfinite(x) for x in low + high):
                raise ValueError("Missing or non-finite position bounds")
            if any(a > b for a, b in zip(low, high)) or position.get("count", 0) < 3:
                raise ValueError("Invalid position bounds/count")
            if indices.get("count", 0) <= 0 or indices["count"] % 3:
                raise ValueError("Invalid triangle index count")
            triangles += indices["count"] // 3
            bounds.append({"min": low, "max": high})
    if not 0 < triangles <= max_asset_triangles:
        raise ValueError("Triangle budget failed")
    return {"status": "PASS", "scope": "atelier-contract-v1", "filename": path.name,
            "sha256": file_digest(path), "bytes": len(data), "triangles": triangles,
            "nodes": names, "primitiveBounds": bounds}
