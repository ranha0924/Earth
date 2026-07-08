import { describe, it, expect } from 'vitest'
import { featureToIso } from './featureIso'

describe('featureToIso', () => {
  it('ISO_A2를 대문자로 반환한다', () => {
    expect(featureToIso({ properties: { ISO_A2: 'kr' } })).toBe('KR')
  })
  it('ISO_A2가 -99이면 ISO_A2_EH로 폴백한다', () => {
    expect(featureToIso({ properties: { ISO_A2: '-99', ISO_A2_EH: 'FR' } })).toBe('FR')
  })
  it('식별 불가하면 null', () => {
    expect(featureToIso({ properties: { ISO_A2: '-99' } })).toBeNull()
    expect(featureToIso({})).toBeNull()
    expect(featureToIso(null)).toBeNull()
  })
})
