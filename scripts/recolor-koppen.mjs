// Recolors public/textures/koppen.png (Beck et al. 2018 Köppen-Geiger classification map,
// standard ~30-class palette) into the app's 6-group legend palette.
//
// Usage:
//   node scripts/recolor-koppen.mjs            # recolor koppen-standard.png -> koppen.png
//   node scripts/recolor-koppen.mjs --inspect   # just print the dominant source colors
//   node scripts/recolor-koppen.mjs --verify    # sample known lat/lng points on koppen.png
//
// See scripts/README.md for the full source-palette -> group-color mapping table.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public/textures/koppen-standard.png');
const OUT = path.join(ROOT, 'public/textures/koppen.png');

// Standard Beck et al. (2018) Köppen-Geiger 30-class legend RGB values, grouped by
// Köppen main group, mapped to the app's 6-group legend palette.
//
//   A tropical              -> 열대 #1b7837
//   B arid                  -> 건조 #f2c744
//   C temperate             -> 온대 #91cf60
//   D continental/cold      -> 냉대 #4575b4
//   E polar                 -> 한대 #d9d9d9
//   (no F/highland class exists in Köppen-Geiger; 고산 has no target pixels here)
const GROUP_COLORS = {
  A: [0x1b, 0x78, 0x37],
  B: [0xf2, 0xc7, 0x44],
  C: [0x91, 0xcf, 0x60],
  D: [0x45, 0x75, 0xb4],
  E: [0xd9, 0xd9, 0xd9],
};

// className: [r,g,b] (standard Beck et al. legend), group letter
const CLASS_TABLE = [
  ['Af', [0, 0, 255], 'A'],
  ['Am', [0, 120, 255], 'A'],
  ['Aw/As', [70, 170, 250], 'A'],

  ['BWh', [255, 0, 0], 'B'],
  ['BWk', [255, 150, 150], 'B'],
  ['BSh', [245, 165, 0], 'B'],
  ['BSk', [255, 220, 100], 'B'],

  ['Csa', [255, 255, 0], 'C'],
  ['Csb', [200, 200, 0], 'C'],
  ['Csc', [150, 150, 0], 'C'],
  ['Cwa', [150, 255, 150], 'C'],
  ['Cwb', [100, 200, 100], 'C'],
  ['Cwc', [50, 150, 50], 'C'],
  ['Cfa', [200, 255, 80], 'C'],
  ['Cfb', [100, 255, 80], 'C'],
  ['Cfc', [50, 200, 0], 'C'],

  ['Dsa', [255, 0, 255], 'D'],
  ['Dsb', [200, 0, 200], 'D'],
  ['Dsc', [150, 50, 150], 'D'],
  ['Dsd', [150, 100, 150], 'D'],
  ['Dwa', [170, 175, 255], 'D'],
  ['Dwb', [89, 120, 220], 'D'],
  ['Dwc', [75, 80, 179], 'D'],
  ['Dwd', [50, 0, 135], 'D'],
  ['Dfa', [0, 255, 255], 'D'],
  ['Dfb', [55, 200, 255], 'D'],
  ['Dfc', [0, 125, 125], 'D'],
  ['Dfd', [0, 70, 95], 'D'],

  ['ET', [178, 178, 178], 'E'],
  ['EF', [102, 102, 102], 'E'],
];

const LOOKUP = CLASS_TABLE.map(([name, rgb, group]) => ({
  name,
  rgb,
  target: GROUP_COLORS[group],
}));

function nearestTarget(r, g, b) {
  let best = null;
  let bestDist = Infinity;
  for (const entry of LOOKUP) {
    const [er, eg, eb] = entry.rgb;
    const d = (r - er) ** 2 + (g - eg) ** 2 + (b - eb) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = entry;
    }
  }
  return best;
}

function isOceanOrNoData(r, g, b, a) {
  // Fully (or mostly) transparent -> no-data / ocean in the source texture.
  if (a < 16) return true;
  // Near-white, opaque pixel (not part of the 30-class palette) -> treat as ocean too,
  // just in case some export step flattened alpha to white.
  if (a >= 16 && r > 250 && g > 250 && b > 250) return true;
  return false;
}

function loadPng(file) {
  return PNG.sync.read(fs.readFileSync(file));
}

function inspect() {
  const png = loadPng(SRC);
  const { width, height, data } = png;
  console.log('dims', width, height);
  const counts = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const key = `${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  console.log('total distinct colors:', sorted.length);
  for (const [k, c] of sorted.slice(0, 40)) {
    console.log(k, c);
  }
}

function recolor() {
  const png = loadPng(SRC);
  const { width, height, data } = png;
  const out = new PNG({ width, height });

  let oceanCount = 0;
  let paintedCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];

    if (isOceanOrNoData(r, g, b, a)) {
      out.data[i] = r;
      out.data[i + 1] = g;
      out.data[i + 2] = b;
      out.data[i + 3] = a;
      oceanCount++;
      continue;
    }

    const match = nearestTarget(r, g, b);
    const [tr, tg, tb] = match.target;
    out.data[i] = tr;
    out.data[i + 1] = tg;
    out.data[i + 2] = tb;
    out.data[i + 3] = 255;
    paintedCount++;
  }

  fs.writeFileSync(OUT, PNG.sync.write(out));
  console.log('wrote', OUT);
  console.log('ocean/no-data pixels:', oceanCount);
  console.log('painted (land) pixels:', paintedCount);
}

function hex([r, g, b]) {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

function verify() {
  const png = loadPng(OUT);
  const { width, height, data } = png;

  const points = [
    ['Amazon', -3, -60, '#1b7837'],
    ['Sahara', 23, 13, '#f2c744'],
    ['Western Europe / France', 47, 2, '#91cf60'],
    ['Central Siberia', 63, 100, '#4575b4'],
    ['Antarctica', -80, 0, '#d9d9d9'],
    ['Mid-Pacific ocean', 0, -140, 'ocean (preserve)'],
  ];

  for (const [label, lat, lng, expected] of points) {
    const x = Math.min(width - 1, Math.floor(((lng + 180) / 360) * width));
    const y = Math.min(height - 1, Math.floor(((90 - lat) / 180) * height));
    const idx = (y * width + x) * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
    const rgbHex = hex([r, g, b]);
    console.log(
      `${label} (lat ${lat}, lng ${lng}) px(${x},${y}) -> rgba(${r},${g},${b},${a}) hex=${rgbHex} expected=${expected}`
    );
  }
}

const args = process.argv.slice(2);
if (args.includes('--inspect')) {
  inspect();
} else if (args.includes('--verify')) {
  verify();
} else {
  recolor();
}
