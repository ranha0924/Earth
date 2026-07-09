// Recolors koppen-standard.png (Beck et al. 2018 Köppen-Geiger classification map,
// standard ~30-class palette, equirectangular 4320×2160) into the app's 14-subtype
// 통합사회(필립스 세계지도 2021) 팔레트. 바다/no-data → 크림색(#ece1c6) 불투명.
//
// Usage:
//   node scripts/recolor-koppen.mjs            # koppen-standard.png -> koppen.png
//   node scripts/recolor-koppen.mjs --inspect   # print dominant source colors
//   node scripts/recolor-koppen.mjs --verify    # sample known lat/lng points on koppen.png

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public/textures/koppen-standard.png');
const OUT = path.join(ROOT, 'public/textures/koppen.png');

const OCEAN = [0xec, 0xe1, 0xc6]; // 크림 바다 (App.css --ocean)

// 14 소분류 → 교과서 색 (src/climate/subtypes.ts SUBTYPE와 동일)
const HEX = {
  Af: '#e23b2c', Am: '#ef8b34', Aw: '#f4d13c',
  BS: '#ece3c4', BW: '#d6af5a',
  Cfa: '#367a31', Cfb: '#77b04c', Cs: '#b6cd61', Cw: '#9dc44d',
  Df: '#a8dedb', Dw: '#67c4c6',
  ET: '#cbbde0', EF: '#9d80c5',
};
const h2rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

// 표준 Beck et al. 30-class 원본 RGB → 14 소분류. (Ds 여름건조 냉대는 희귀 → Dw로, Cfc→Cfb 등 병합)
const CLASS_TABLE = [
  ['Af', [0, 0, 255], 'Af'],
  ['Am', [0, 120, 255], 'Am'],
  ['Aw/As', [70, 170, 250], 'Aw'],

  ['BWh', [255, 0, 0], 'BW'],
  ['BWk', [255, 150, 150], 'BW'],
  ['BSh', [245, 165, 0], 'BS'],
  ['BSk', [255, 220, 100], 'BS'],

  ['Csa', [255, 255, 0], 'Cs'],
  ['Csb', [200, 200, 0], 'Cs'],
  ['Csc', [150, 150, 0], 'Cs'],
  ['Cwa', [150, 255, 150], 'Cw'],
  ['Cwb', [100, 200, 100], 'Cw'],
  ['Cwc', [50, 150, 50], 'Cw'],
  ['Cfa', [200, 255, 80], 'Cfa'],
  ['Cfb', [100, 255, 80], 'Cfb'],
  ['Cfc', [50, 200, 0], 'Cfb'],

  ['Dsa', [255, 0, 255], 'Dw'],
  ['Dsb', [200, 0, 200], 'Dw'],
  ['Dsc', [150, 50, 150], 'Dw'],
  ['Dsd', [150, 100, 150], 'Dw'],
  ['Dwa', [170, 175, 255], 'Dw'],
  ['Dwb', [89, 120, 220], 'Dw'],
  ['Dwc', [75, 80, 179], 'Dw'],
  ['Dwd', [50, 0, 135], 'Dw'],
  ['Dfa', [0, 255, 255], 'Df'],
  ['Dfb', [55, 200, 255], 'Df'],
  ['Dfc', [0, 125, 125], 'Df'],
  ['Dfd', [0, 70, 95], 'Df'],

  ['ET', [178, 178, 178], 'ET'],
  ['EF', [102, 102, 102], 'EF'],
];

const LOOKUP = CLASS_TABLE.map(([name, rgb, sub]) => ({ name, rgb, target: h2rgb(HEX[sub]) }));

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
  if (a < 16) return true;
  if (a >= 16 && r > 250 && g > 250 && b > 250) return true;
  return false;
}

const loadPng = (file) => PNG.sync.read(fs.readFileSync(file));

function inspect() {
  const { width, height, data } = loadPng(SRC);
  console.log('dims', width, height);
  const counts = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const key = `${data[i]},${data[i + 1]},${data[i + 2]},${data[i + 3]}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  console.log('total distinct colors:', sorted.length);
  for (const [k, c] of sorted.slice(0, 40)) console.log(k, c);
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
      out.data[i] = OCEAN[0];
      out.data[i + 1] = OCEAN[1];
      out.data[i + 2] = OCEAN[2];
      out.data[i + 3] = 255;
      oceanCount++;
      continue;
    }
    const [tr, tg, tb] = nearestTarget(r, g, b).target;
    out.data[i] = tr;
    out.data[i + 1] = tg;
    out.data[i + 2] = tb;
    out.data[i + 3] = 255;
    paintedCount++;
  }

  fs.writeFileSync(OUT, PNG.sync.write(out));
  console.log('wrote', OUT);
  console.log('ocean/no-data pixels -> cream:', oceanCount);
  console.log('painted (land) pixels:', paintedCount);
}

const hex = ([r, g, b]) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');

function verify() {
  const { width, height, data } = loadPng(OUT);
  const points = [
    ['Amazon', -3, -60, HEX.Af],
    ['Sahara', 23, 13, HEX.BW],
    ['Sahel', 15, 5, HEX.BS],
    ['Western Europe / France', 47, 2, HEX.Cfb],
    ['Mediterranean / Spain', 39, -4, HEX.Cs],
    ['Central Siberia', 63, 100, HEX.Df],
    ['NE China / Manchuria', 47, 125, HEX.Dw],
    ['Antarctica', -80, 0, HEX.EF + ' or ' + HEX.ET],
    ['Mid-Pacific ocean', 0, -140, hex(OCEAN) + ' (cream)'],
  ];
  for (const [label, lat, lng, expected] of points) {
    const x = Math.min(width - 1, Math.floor(((lng + 180) / 360) * width));
    const y = Math.min(height - 1, Math.floor(((90 - lat) / 180) * height));
    const idx = (y * width + x) * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
    console.log(`${label} (lat ${lat}, lng ${lng}) -> ${hex([r, g, b])} a=${a}  expected=${expected}`);
  }
}

const args = process.argv.slice(2);
if (args.includes('--inspect')) inspect();
else if (args.includes('--verify')) verify();
else recolor();
