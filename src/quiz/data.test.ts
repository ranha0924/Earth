import { describe, it, expect } from 'vitest'
import { QUIZ_BANK } from './data'
import { isMapQuestion, isGraphQuestion } from './types'
import { hasCountryName } from '../data/countryNames'
import { getFeaturedClimate } from '../climate/featured'

describe('퀴즈 문제 은행', () => {
  it('문제가 충분히(30개 이상) 있다', () => {
    expect(QUIZ_BANK.length).toBeGreaterThanOrEqual(30)
  })
  it('문제 id가 모두 고유하다', () => {
    const ids = QUIZ_BANK.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('선택형 문제의 정답 인덱스가 보기 범위 안에 있다', () => {
    for (const q of QUIZ_BANK) {
      if (isMapQuestion(q)) continue
      expect(q.choices.length).toBe(4)
      expect(q.answerIndex).toBeGreaterThanOrEqual(0)
      expect(q.answerIndex).toBeLessThan(q.choices.length)
      expect(q.explanation).not.toBe('')
    }
  })
  it('그래프 문제는 기후 그래프 데이터가 있는 나라를 참조한다', () => {
    for (const q of QUIZ_BANK) {
      if (!isGraphQuestion(q)) continue
      expect(getFeaturedClimate(q.graphIso)).not.toBeNull()
    }
  })
  it('지도 문제의 정답 나라 ISO가 실제 국가명 데이터에 존재한다', () => {
    for (const q of QUIZ_BANK) {
      if (!isMapQuestion(q)) continue
      expect(q.answerIsos.length).toBeGreaterThan(0)
      for (const iso of q.answerIsos) expect(hasCountryName(iso)).toBe(true)
    }
  })
  it('6개 카테고리가 모두 출제된다', () => {
    const cats = new Set(QUIZ_BANK.map((q) => q.category))
    expect(cats).toEqual(new Set(['climate', 'environment', 'treaty', 'culture', 'map', 'graph']))
  })
})
