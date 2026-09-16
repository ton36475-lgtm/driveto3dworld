#!/bin/sh
set -eu
cd /workspace
if [ ! -d node_modules/three ]; then
  npm install --legacy-peer-deps
fi
if [ ! -f public/audio/engine.wav ]; then
  node scripts/gen-audio.mjs
fi
node scripts/preview.mjs stop || true
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
