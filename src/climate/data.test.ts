import { describe, it, expect } from 'vitest'
import { getCountryClimate } from './data'
import type { ClimateData } from './types'

const sample: ClimateData = {
  KR: { nameKo: '대한민국', nameEn: 'South Korea', group: '온대', subtype: '온난습윤' },
}

describe('getCountryClimate', () => {
  it('대문자 ISO 코드로 조회한다', () => {
    expect(getCountryClimate(sample, 'KR')?.group).toBe('온대')
  })
  it('소문자도 대문자로 정규화해 조회한다', () => {
    expect(getCountryClimate(sample, 'kr')?.nameKo).toBe('대한민국')
  })
  it('데이터가 없으면 null', () => {
    expect(getCountryClimate(sample, 'ZZ')).toBeNull()
  })
  it('null/undefined 입력이면 null', () => {
    expect(getCountryClimate(sample, null)).toBeNull()
    expect(getCountryClimate(sample, undefined)).toBeNull()
  })
  it('빈 문자열이면 null', () => {
    expect(getCountryClimate(sample, '')).toBeNull()
  })
})
