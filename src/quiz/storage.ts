// 퀴즈 점수·오답 기록을 localStorage에 저장 (백엔드 없이 재방문 학습 지원)

import type { QuizCategory } from './types'

const KEY = 'globe-quiz-v1'

export interface CatStat {
  correct: number
  total: number
}
export type CatStats = Partial<Record<QuizCategory, CatStat>>

export interface QuizRecord {
  bestScore: number
  playCount: number
  wrongIds: string[] // 최근 오답 문제 id (누적, 중복 제거)
  cats: CatStats // 카테고리별 누적 정답/총 문항 (약점 분석용)
}

const EMPTY: QuizRecord = { bestScore: 0, playCount: 0, wrongIds: [], cats: {} }

function normalizeCats(raw: unknown): CatStats {
  if (!raw || typeof raw !== 'object') return {}
  const out: CatStats = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (v && typeof v === 'object') {
      const c = (v as CatStat).correct
      const t = (v as CatStat).total
      if (typeof c === 'number' && typeof t === 'number') {
        out[k as QuizCategory] = { correct: c, total: t }
      }
    }
  }
  return out
}

export function loadRecord(): QuizRecord {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY, cats: {} }
    const parsed = JSON.parse(raw) as Partial<QuizRecord>
    return {
      bestScore: parsed.bestScore ?? 0,
      playCount: parsed.playCount ?? 0,
      wrongIds: Array.isArray(parsed.wrongIds) ? parsed.wrongIds : [],
      cats: normalizeCats(parsed.cats),
    }
  } catch {
    return { ...EMPTY, cats: {} }
  }
}

export function saveResult(score: number, wrongIds: string[], cats: CatStats = {}): QuizRecord {
  const prev = loadRecord()
  const mergedCats: CatStats = { ...prev.cats }
  for (const [k, v] of Object.entries(cats)) {
    if (!v) continue
    const cat = k as QuizCategory
    const cur = mergedCats[cat] ?? { correct: 0, total: 0 }
    mergedCats[cat] = { correct: cur.correct + v.correct, total: cur.total + v.total }
  }
  const merged: QuizRecord = {
    bestScore: Math.max(prev.bestScore, score),
    playCount: prev.playCount + 1,
    wrongIds: Array.from(new Set([...prev.wrongIds, ...wrongIds])).slice(-30),
    cats: mergedCats,
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(merged))
  } catch {
    // 저장 실패해도 게임 진행에는 영향 없음
  }
  return merged
}

export function clearRecord(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // 무시
  }
}
