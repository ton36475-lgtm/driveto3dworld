#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public", "audio");
fs.mkdirSync(ROOT, { recursive: true });

function writeWav(file, samples, sampleRate = 22050) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE((s * 32767) | 0, 44 + i * 2);
  }
  fs.writeFileSync(path.join(ROOT, file), buf);
}

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TAU = Math.PI * 2;

function engine() {
  const sr = 22050;
  const n = sr * 2;
  const out = new Float32Array(n);
  const rnd = mulberry32(7);
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    const pulse = 0.5 + 0.5 * Math.sin(TAU * 28 * t);
    out[i] =
      0.28 * Math.sin(TAU * 55 * t) +
      0.16 * Math.sin(TAU * 110 * t) +
      0.08 * Math.sin(TAU * 27.5 * t) * pulse +
      0.04 * (rnd() * 2 - 1);
  }
  return out;
}

function wind() {
  const sr = 22050;
  const n = sr * 3;
  const out = new Float32Array(n);
  const rnd = mulberry32(99);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    const white = rnd() * 2 - 1;
    lp = lp * 0.96 + white * 0.04;
    const gust = 0.6 + 0.4 * Math.sin(TAU * 0.22 * t);
    out[i] = lp * 1.8 * gust;
  }
  return out;
}

function collect() {
  const sr = 22050;
  const n = Math.floor(sr * 0.45);
  const out = new Float32Array(n);
  const notes = [784, 1175, 1568];
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    let s = 0;
    for (let k = 0; k < notes.length; k++) {
      const env = Math.exp(-t * (5 + k * 2));
      const gate = t > k * 0.07 ? 1 : 0;
      s += Math.sin(TAU * notes[k] * t) * env * gate * 0.28;
    }
    out[i] = s;
  }
  return out;
}

function pad(seed, f1, f2) {
  const sr = 22050;
  const n = sr * 4;
  const out = new Float32Array(n);
  const rnd = mulberry32(seed);
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    const a = Math.sin(TAU * f1 * t + Math.sin(TAU * 0.15 * t) * 0.4);
    const b = Math.sin(TAU * f2 * t + 0.2);
    const c = Math.sin(TAU * (f1 * 0.5) * t) * 0.35;
    const fade =
      0.5 - 0.5 * Math.cos(TAU * (i / n)); /* seamless-ish edges */
    out[i] = (a * 0.22 + b * 0.14 + c * 0.1 + (rnd() * 2 - 1) * 0.01) * (0.7 + fade * 0.3);
  }
  return out;
}

writeWav("engine.wav", engine());
writeWav("wind.wav", wind());
writeWav("collect.wav", collect());
writeWav("zone-arch.wav", pad(11, 110, 165));
writeWav("zone-char.wav", pad(23, 98, 196));
writeWav("zone-veh.wav", pad(41, 73, 146));
writeWav("zone-prod.wav", pad(67, 87, 174));
console.log("audio written", ROOT);
