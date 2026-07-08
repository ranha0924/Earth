import { describe, it, expect } from 'vitest'
import { ISSUES, TREATIES, ISSUE_BY_ID, TREATY_BY_ID } from './data'

describe('환경문제 데이터', () => {
  it('환경문제 7개가 있다', () => {
    expect(ISSUES).toHaveLength(7)
  })
  it('산성비·미세먼지는 직접 대응 협약이 없다', () => {
    expect(ISSUE_BY_ID['acid-rain'].treaties).toHaveLength(0)
    expect(ISSUE_BY_ID['fine-dust'].treaties).toHaveLength(0)
  })
  it('오존층 파괴는 몬트리올 의정서와 연결된다', () => {
    expect(ISSUE_BY_ID['ozone'].treaties).toContain('montreal')
  })
  it('모든 환경문제가 원인·현상·영향·대책을 갖는다', () => {
    for (const i of ISSUES) {
      expect(i.cause).not.toBe('')
      expect(i.phenomenon).not.toBe('')
      expect(i.effect).not.toBe('')
      expect(i.solution).not.toBe('')
      expect(i.regions.length).toBeGreaterThan(0)
    }
  })
})

describe('국제협약 데이터', () => {
  it('협약 9개가 연도순으로 정렬돼 있다', () => {
    expect(TREATIES).toHaveLength(9)
    const years = TREATIES.map((t) => t.year)
    expect([...years].sort((a, b) => a - b)).toEqual(years)
  })
  it('협약 연도가 정확하다', () => {
    expect(TREATY_BY_ID['ramsar'].year).toBe(1971)
    expect(TREATY_BY_ID['montreal'].year).toBe(1987)
    expect(TREATY_BY_ID['kyoto'].year).toBe(1997)
    expect(TREATY_BY_ID['paris'].year).toBe(2015)
  })
  it('기후변화협약·교토·파리가 climate 계보로 묶인다', () => {
    const climate = TREATIES.filter((t) => t.lineage === 'climate').map((t) => t.id)
    expect(climate).toEqual(['unfccc', 'kyoto', 'paris'])
  })
})
