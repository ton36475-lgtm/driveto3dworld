"""Portable preflight/build/verify/publish without shell commands or Python dependencies."""
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from contract import EXPORTS, file_digest, inspect_glb, verify_structure

HERE = Path(__file__).resolve().parent


def blender_executable():
    candidate = os.environ.get("BLENDER_BIN") or shutil.which("blender")
    if not candidate and sys.platform == "darwin":
        candidate = "/Applications/Blender.app/Contents/MacOS/Blender"
    if not candidate or not Path(candidate).is_file():
        raise ValueError("Blender unavailable. Install official Blender 4.5 LTS or set BLENDER_BIN to its executable.")
    version = subprocess.run([candidate, "--version"], check=True, capture_output=True, text=True, timeout=30)
    if not version.stdout.startswith("Blender 4.5."):
        raise ValueError("This pipeline is verified against Blender 4.5 LTS. Received: " + version.stdout.splitlines()[0])
    return str(Path(candidate).resolve()), version.stdout.splitlines()[0]


def verify_build(source):
    source = source.resolve()
    receipt = json.loads((source / "build-receipt.json").read_text())
    if receipt.get("status") != "PASS" or receipt.get("structureValidation", {}).get("status") != "PASS":
        raise ValueError("Build or structural verification did not pass")
    baseline_file = source / "structural-baseline.json"
    if file_digest(baseline_file) != receipt.get("baselineSha256"):
        raise ValueError("Baseline digest mismatch against receipt")
    baseline = json.loads(baseline_file.read_text())
    verify_structure(baseline, baseline["objects"])
    if baseline["structureHash"] != receipt["structureValidation"]["structureHash"]:
        raise ValueError("Receipt uses a different structural baseline")
    for filename, key in [("atelier-structural.blend", "structuralSourceSha256"), ("atelier-final.blend", "finalSourceSha256")]:
        if file_digest(source / filename) != receipt.get(key):
            raise ValueError(f"Source digest mismatch: {filename}")
    actual = [inspect_glb(source / "models" / filename, root) for root, filename in EXPORTS.items()]
    expected = {asset["filename"]: asset["sha256"] for asset in receipt["assets"]}
    if any(asset["sha256"] != expected.get(asset["filename"]) for asset in actual):
        raise ValueError("GLB digest mismatch against build receipt")
    return receipt, actual


def publish(source, destination):
    receipt, assets = verify_build(source)
    destination.mkdir(parents=True, exist_ok=True)
    lock = destination / ".publish.lock"
    # An exclusive local lock prevents concurrent writers; do not auto-steal stale locks.
    descriptor = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    try:
        os.write(descriptor, str(os.getpid()).encode())
        with tempfile.TemporaryDirectory(prefix=".asset-stage-", dir=destination) as temp:
            stage = Path(temp)
            for name in EXPORTS.values():
                shutil.copyfile(source / "models" / name, stage / name)
            manifest = {"schemaVersion": 1, "generator": "Blender " + receipt["blenderVersion"],
                        "structureHash": receipt["structureValidation"]["structureHash"],
                        "coordinateSystem": receipt["coordinateSystem"], "assets": assets,
                        "provenance": "Original procedural atelier assets; no third-party models or fonts",
                        "runtime": {"work-frame.glb": "frame geometry; app supplies artwork texture",
                                    "monogram.glb": "available asset; integration tracked separately",
                                    "plinth.glb": "available asset; integration tracked separately"}}
            (stage / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
            for name in [*EXPORTS.values(), "manifest.json"]:
                os.replace(stage / name, destination / name)
    finally:
        os.close(descriptor)
        lock.unlink(missing_ok=True)
    return assets


def main():
    parser = argparse.ArgumentParser()
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("doctor")
    build = commands.add_parser("build")
    build.add_argument("--output-dir", type=Path, required=True)
    verify = commands.add_parser("verify")
    verify.add_argument("source", type=Path)
    publish_cmd = commands.add_parser("publish")
    publish_cmd.add_argument("source", type=Path)
    publish_cmd.add_argument("--destination", type=Path, default=HERE.parent / "public/models")
    args = parser.parse_args()
    if args.command == "doctor":
        executable, version = blender_executable()
        print(json.dumps({"status": "PASS", "blender": executable, "version": version, "python": sys.version.split()[0]}))
    elif args.command == "build":
        executable, _ = blender_executable()
        subprocess.run([executable, "--background", "--factory-startup", "--disable-autoexec", "--python-exit-code", "1",
                        "--python", str(HERE / "build_assets.py"), "--", "--output-dir", str(args.output_dir.resolve())], check=True)
    elif args.command == "verify":
        _, assets = verify_build(args.source)
        print(json.dumps({"status": "PASS", "assets": assets}, indent=2))
    elif args.command == "publish":
        assets = publish(args.source.resolve(), args.destination.resolve())
        print(json.dumps({"status": "PASS", "published": [asset["filename"] for asset in assets]}))


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, KeyError, subprocess.SubprocessError) as error:
        print(f"PIPELINE_FAILED: {error}", file=sys.stderr)
        sys.exit(1)
