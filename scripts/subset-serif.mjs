// Noto Serif KR 서브셋 생성 — 앱이 실제로 렌더하는 글리프만 남겨 폰트 용량을 줄인다.
//
// @fontsource/noto-serif-kr 의 'korean' 서브셋은 한글 블록 전체(가중치당 ~1MB)를
// 담고 있다. 이 사이트가 세리프로 표시하는 한글은 src 안 텍스트로 한정되므로,
// 그 글리프 집합만 뽑아 pyftsubset 으로 재서브셋한다(가중치당 ~1MB → 수백 KB).
//
// 사전 준비:  pip install fonttools brotli
// 실행:       node scripts/subset-serif.mjs
// 산출물:     src/fonts/noto-serif-kr-<weight>.subset.woff2  (커밋 대상)
//
// 데이터(나라 이름 등)를 추가해 새 한글이 생기면 이 스크립트를 다시 돌려
// 서브셋을 갱신한다. (안 그러면 새 글자가 시스템 세리프로 대체 렌더됨)

import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = join(ROOT, 'src')
const OUT_DIR = join(ROOT, 'src', 'fonts')
const FONT_DIR = join(ROOT, 'node_modules', '@fontsource', 'noto-serif-kr', 'files')
const WEIGHTS = [500, 700]
const TEXT_EXT = /\.(ts|tsx|json|css|html|md)$/

// ── 1) src 전체에서 표시용 글리프 수집 ──────────────────────────────
function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (TEXT_EXT.test(name)) out.push(p)
  }
  return out
}

const chars = new Set()
// 라틴/숫자/기본 문장부호는 항상 포함(아직 안 쓰였어도 안전하게).
for (let c = 0x20; c <= 0x7e; c++) chars.add(String.fromCodePoint(c))
// src 안에서 실제 등장하는 비ASCII(한글·기호 등)를 모두 포함.
for (const file of [...walk(SRC_DIR), join(ROOT, 'index.html')]) {
  for (const ch of readFileSync(file, 'utf8')) {
    if (ch.codePointAt(0) >= 0xa0) chars.add(ch)
  }
}
const text = [...chars].join('')
const charsFile = join(tmpdir(), 'serif-charset.txt')
writeFileSync(charsFile, text, 'utf8')
console.log(`수집 글리프: ${chars.size}자`)

// ── 2) 가중치별 재서브셋 ───────────────────────────────────────────
mkdirSync(OUT_DIR, { recursive: true })
for (const w of WEIGHTS) {
  const input = join(FONT_DIR, `noto-serif-kr-korean-${w}-normal.woff2`)
  const output = join(OUT_DIR, `noto-serif-kr-${w}.subset.woff2`)
  execFileSync('pyftsubset', [
    input,
    `--text-file=${charsFile}`,
    `--output-file=${output}`,
    '--flavor=woff2',
    '--layout-features=*',
  ])
  const before = statSync(input).size
  const after = statSync(output).size
  console.log(
    `w${w}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB ` +
      `(${((1 - after / before) * 100).toFixed(0)}% 감소)`,
  )
}
console.log('완료 → src/fonts/')
