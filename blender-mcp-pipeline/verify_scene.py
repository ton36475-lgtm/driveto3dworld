"""Check a loaded .blend against a structural baseline before accepting a handoff."""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_assets import snapshot
from contract import verify_structure

parser = argparse.ArgumentParser()
parser.add_argument("--baseline", type=Path, required=True)
parser.add_argument("--expected-hash", required=True, help="Digest from the independently recorded handoff")
args = parser.parse_args(sys.argv[sys.argv.index("--")+1:] if "--" in sys.argv else [])
baseline = json.loads(args.baseline.read_text())
if baseline.get("structureHash") != args.expected_hash:
    raise ValueError("Untrusted baseline: handoff digest does not match")
result = verify_structure(baseline, snapshot())
print(json.dumps(result, sort_keys=True))
