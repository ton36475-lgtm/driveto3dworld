"""Independent loaded-scene check against the foodtruck's handed-off structure digest."""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parent))
from build_foodtruck import verify
from build_assets import snapshot

parser=argparse.ArgumentParser()
parser.add_argument('--baseline',type=Path,required=True)
parser.add_argument('--expected-hash',required=True)
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
baseline=json.loads(args.baseline.read_text())
if baseline.get('structureHash')!=args.expected_hash:
    raise ValueError('Baseline differs from independently recorded handoff')
print(json.dumps(verify(baseline,snapshot()),sort_keys=True))
