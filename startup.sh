#!/bin/sh
set -eu
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$SCRIPT_DIR"
command -v node >/dev/null 2>&1 || { echo 'Node is missing. Install Node 24 LTS, then retry.' >&2; exit 1; }
exec node scripts/start-runtime.mjs
