"""Regression tests for failure modes that previously silently published bad exports."""
import copy
import json
import struct
import tempfile
import unittest
from pathlib import Path

from contract import EXPORTS, digest, inspect_glb, lock_structure, require_objects, safe_output_directory, verify_structure


def fixture_objects():
    result = {name: {"type": "EMPTY", "parent": None, "matrixWorld": [1, 0, 0, 1]} for name in EXPORTS}
    result["Artwork"] = {"type": "MESH", "parent": "Frame_Work", "geometryHash": digest([0, 1, 2])}
    return result


def fixture_glb(document=None):
    if document is None:
        document = {"asset": {"version": "2.0"}, "scene": 0, "scenes": [{"nodes": [0]}],
                    "nodes": [{"name": "Plinth", "mesh": 0}],
                    "buffers": [{"byteLength": 42}],
                    "bufferViews": [{"buffer": 0, "byteLength": 36}, {"buffer": 0, "byteOffset": 36, "byteLength": 6}],
                    "accessors": [{"bufferView": 0, "componentType": 5126, "type": "VEC3", "count": 3, "min": [0,0,0], "max": [1,1,0]},
                                  {"bufferView": 1, "componentType": 5123, "type": "SCALAR", "count": 3}],
                    "meshes": [{"primitives": [{"attributes": {"POSITION": 0}, "indices": 1}]}]}
    raw = json.dumps(document).encode()
    raw += b" " * (-len(raw) % 4)
    binary = struct.pack("<9f3H", 0,0,0, 1,0,0, 0,1,0, 0,1,2) + b"\0\0"
    body = struct.pack("<I4s",len(raw),b"JSON") + raw + struct.pack("<I4s",len(binary),b"BIN\0") + binary
    return struct.pack("<4sII",b"glTF",2,len(body)+12) + body


class StructuralLockTests(unittest.TestCase):
    def test_missing_root_fails(self):
        with self.assertRaisesRegex(ValueError, "Monogram_SxB"):
            require_objects(["Frame_Work", "Artwork", "Plinth"])

    def test_missing_artwork_fails(self):
        with self.assertRaisesRegex(ValueError, "Artwork"):
            require_objects(EXPORTS)

    def test_unchanged_structure_passes(self):
        objects = fixture_objects()
        self.assertEqual(verify_structure(lock_structure(objects), copy.deepcopy(objects))["status"], "PASS")

    def test_geometry_change_fails(self):
        original = fixture_objects()
        changed = copy.deepcopy(original)
        changed["Artwork"]["geometryHash"] = digest([0,1,3])
        with self.assertRaisesRegex(ValueError, "Artwork"):
            verify_structure(lock_structure(original), changed)

    def test_transform_change_fails(self):
        original = fixture_objects()
        changed = copy.deepcopy(original)
        changed["Frame_Work"]["matrixWorld"][0] = 2
        with self.assertRaisesRegex(ValueError, "Frame_Work"):
            verify_structure(lock_structure(original), changed)

    def test_reparenting_fails(self):
        original = fixture_objects()
        changed = copy.deepcopy(original)
        changed["Artwork"]["parent"] = "Plinth"
        with self.assertRaisesRegex(ValueError, "Artwork"):
            verify_structure(lock_structure(original), changed)

    def test_extra_structural_object_fails(self):
        original = fixture_objects()
        changed = copy.deepcopy(original)
        changed["SurpriseWall"] = {"type": "EMPTY"}
        with self.assertRaisesRegex(ValueError, "SurpriseWall"):
            verify_structure(lock_structure(original), changed)

    def test_tampered_baseline_fails(self):
        baseline = lock_structure(fixture_objects())
        baseline["objects"]["Artwork"]["parent"] = "Plinth"
        with self.assertRaisesRegex(ValueError, "digest mismatch"):
            verify_structure(baseline, fixture_objects())

    def test_nan_geometry_cannot_be_hashed(self):
        with self.assertRaises(ValueError):
            digest([float("nan")])

    def test_destination_collision_fails_without_deletion(self):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "owned.blend"
            path.write_bytes(b"original")
            with self.assertRaisesRegex(ValueError, "already owned"):
                safe_output_directory(temp)
            self.assertEqual(path.read_bytes(), b"original")

    def test_parallel_worker_cannot_reuse_empty_destination(self):
        with tempfile.TemporaryDirectory() as temp:
            output = Path(temp) / "worker"
            safe_output_directory(output)
            with self.assertRaisesRegex(ValueError, "already owned"):
                safe_output_directory(output)


class GLBInspectionTests(unittest.TestCase):
    def inspect(self, data, root="Plinth"):
        with tempfile.TemporaryDirectory() as temp:
            path = Path(temp) / "test.glb"
            path.write_bytes(data)
            return inspect_glb(path, root)

    def test_valid_small_asset(self):
        self.assertEqual(self.inspect(fixture_glb())["triangles"], 1)

    def test_truncated_asset_fails(self):
        with self.assertRaises(ValueError):
            self.inspect(fixture_glb()[:-4])

    def test_wrong_header_fails(self):
        with self.assertRaisesRegex(ValueError, "header"):
            self.inspect(b"HTML" + fixture_glb()[4:])

    def test_required_hierarchy_export_fails(self):
        with self.assertRaisesRegex(ValueError, "required asset nodes"):
            self.inspect(fixture_glb(), "Frame_Work")

    def test_no_mesh_fails(self):
        with self.assertRaises(ValueError):
            self.inspect(fixture_glb({"asset": {"version": "2.0"}, "nodes": [{"name": "Plinth"}]}))


if __name__ == "__main__":
    unittest.main()
