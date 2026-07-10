import { describe, it, expect, beforeEach } from 'vitest'
import { loadRecord, saveResult, clearRecord } from './storage'

beforeEach(() => {
  clearRecord()
})

describe('퀴즈 저장(localStorage)', () => {
  it('기록이 없으면 기본값을 준다', () => {
    const r = loadRecord()
    expect(r).toEqual({ bestScore: 0, playCount: 0, wrongIds: [], cats: {} })
  })
  it('결과를 저장하면 최고 점수·판 수·오답이 누적된다', () => {
    saveResult(7, ['c1', 'e2'])
    let r = loadRecord()
    expect(r.bestScore).toBe(7)
    expect(r.playCount).toBe(1)
    expect(r.wrongIds).toEqual(['c1', 'e2'])

    saveResult(5, ['c1', 't3'])
    r = loadRecord()
    expect(r.bestScore).toBe(7) // 더 낮은 점수여도 최고는 유지
    expect(r.playCount).toBe(2)
    expect(r.wrongIds).toEqual(['c1', 'e2', 't3']) // 중복 제거 누적
  })
  it('카테고리별 정답/총 문항이 누적 합산된다', () => {
    saveResult(2, ['climate'], { climate: { correct: 2, total: 3 }, treaty: { correct: 0, total: 1 } })
    let r = loadRecord()
    expect(r.cats.climate).toEqual({ correct: 2, total: 3 })
    expect(r.cats.treaty).toEqual({ correct: 0, total: 1 })

    saveResult(1, [], { climate: { correct: 1, total: 2 } })
    r = loadRecord()
    expect(r.cats.climate).toEqual({ correct: 3, total: 5 }) // 합산
    expect(r.cats.treaty).toEqual({ correct: 0, total: 1 }) // 유지
  })
  it('cats 없이 저장한 옛 기록도 안전하게 로드된다', () => {
    localStorage.setItem('globe-quiz-v1', JSON.stringify({ bestScore: 5, playCount: 1, wrongIds: ['c1'] }))
    const r = loadRecord()
    expect(r.cats).toEqual({})
    expect(r.bestScore).toBe(5)
  })
})
