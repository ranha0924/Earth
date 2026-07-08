// 퀴즈 점수·오답 기록을 localStorage에 저장 (백엔드 없이 재방문 학습 지원)

const KEY = 'globe-quiz-v1'

export interface QuizRecord {
  bestScore: number
  playCount: number
  wrongIds: string[] // 최근 오답 문제 id (누적, 중복 제거)
}

const EMPTY: QuizRecord = { bestScore: 0, playCount: 0, wrongIds: [] }

export function loadRecord(): QuizRecord {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw) as Partial<QuizRecord>
    return {
      bestScore: parsed.bestScore ?? 0,
      playCount: parsed.playCount ?? 0,
      wrongIds: Array.isArray(parsed.wrongIds) ? parsed.wrongIds : [],
    }
  } catch {
    return { ...EMPTY }
  }
}

export function saveResult(score: number, wrongIds: string[]): QuizRecord {
  const prev = loadRecord()
  const merged: QuizRecord = {
    bestScore: Math.max(prev.bestScore, score),
    playCount: prev.playCount + 1,
    wrongIds: Array.from(new Set([...prev.wrongIds, ...wrongIds])).slice(-30),
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
