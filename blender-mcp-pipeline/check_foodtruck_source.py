"""Reopen gate plus deliberate in-memory failures; never saves the loaded scene."""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import bpy
from build_assets import snapshot, write_json
from build_foodtruck import verify
from contract import file_digest


def main(baseline_path, expected_hash, output):
    baseline = json.loads(baseline_path.read_text())
    if baseline['structureHash'] != expected_hash:
        raise ValueError('Baseline differs from independently recorded handoff')
    positive = verify(baseline, snapshot())
    source_path = bpy.data.filepath
    checks = []

    def expect_rejection(case):
        try:
            verify(baseline, snapshot())
        except ValueError as error:
            checks.append({'case': case, 'status': 'PASS', 'rejected': str(error)})
        else:
            raise AssertionError('Structural guard accepted ' + case)

    hatch = bpy.data.objects['ServingHatch_Pivot']
    hatch.rotation_euler.y = -1.35
    expect_rejection('opening runtime joint in stored source')
    bpy.ops.wm.open_mainfile(filepath=source_path)
    verify(baseline, snapshot())

    mesh = bpy.data.objects['Windshield'].data
    vertex = mesh.vertices[0]
    vertex.co.x += .01
    mesh.update()
    expect_rejection('one-centimetre windshield vertex change')
    bpy.ops.wm.open_mainfile(filepath=source_path)
    verify(baseline, snapshot())

    anchor = bpy.data.objects['WheelAnchor_FL']
    bpy.data.objects.remove(anchor, do_unlink=True)
    expect_rejection('missing runtime wheel anchor')

    write_json(output, {
        'status': 'PASS', 'source': Path(bpy.data.filepath).name,
        'sourceSha256': file_digest(bpy.data.filepath),
        'baselineSha256': file_digest(baseline_path),
        'positive': positive, 'negativeChecks': checks,
        'sceneSavedAfterMutation': False,
    })
    print('FOODTRUCK_SOURCE_GATE_PASS')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--baseline', type=Path, required=True)
    parser.add_argument('--expected-hash', required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
    main(args.baseline.resolve(), args.expected_hash, args.output.resolve())
