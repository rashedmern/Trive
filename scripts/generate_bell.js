/* eslint-env node */
/* global Buffer, __dirname */
// scripts/generate_bell.js
// Generates a soft, gentle, subtle notification chime WAV file.
const fs = require('fs');
const path = require('path');

const sampleRate = 44100;
const duration = 0.55; // seconds
const numSamples = Math.floor(sampleRate * duration);
const buffer = Buffer.alloc(44 + numSamples * 2);

// RIFF header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + numSamples * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20); // PCM
buffer.writeUInt16LE(1, 22); // mono
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(numSamples * 2, 40);

// Synthesize gentle, subtle dual-chime:
// Soft attack, warm fundamental, low master amplitude (0.22)
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;

  // Soft envelope attack to remove any initial click (first 10ms)
  const attack = Math.min(1, t / 0.012);

  // Note 1: 1046.5 Hz (C6), smooth decay
  const f1 = 1046.5;
  const decay1 = Math.exp(-7.5 * t);
  const note1 = (Math.sin(2 * Math.PI * f1 * t) * 0.75 +
                 Math.sin(2 * Math.PI * f1 * 2 * t) * 0.12) * decay1 * attack;

  // Note 2: 1318.5 Hz (E6), slightly delayed (t = 0.07)
  let note2 = 0;
  if (t >= 0.07) {
    const t2 = t - 0.07;
    const attack2 = Math.min(1, t2 / 0.012);
    const f2 = 1318.51;
    const decay2 = Math.exp(-7.0 * t2);
    note2 = (Math.sin(2 * Math.PI * f2 * t2) * 0.65 +
             Math.sin(2 * Math.PI * f2 * 2 * t2) * 0.08) * decay2 * attack2;
  }

  // Master volume scaled down to a gentle 0.22 peak amplitude
  const sample = (note1 + note2) * 0.22;
  const clamped = Math.max(-1, Math.min(1, sample));
  const intSample = Math.floor(clamped * 32767);
  buffer.writeInt16LE(intSample, 44 + i * 2);
}

const soundsDir = path.join(__dirname, '..', 'assets', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

const targetPath = path.join(soundsDir, 'bell.wav');
fs.writeFileSync(targetPath, buffer);
console.log(`Generated soft bell ${targetPath} (${buffer.length} bytes)`);
