import { describe, it, expect, beforeEach } from 'vitest'
import { loadRecord, saveResult, clearRecord } from './storage'

beforeEach(() => {
  clearRecord()
})

describe('퀴즈 저장(localStorage)', () => {
  it('기록이 없으면 기본값을 준다', () => {
    const r = loadRecord()
    expect(r).toEqual({ bestScore: 0, playCount: 0, wrongIds: [] })
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
})
