import { describe, it, expect } from 'vitest'
import { religionData, cultureData, getReligion, getCulture } from './data'
import { FESTIVALS } from './festivals'
import { FESTIVAL_IMAGES } from './festivalImages'
import { RELIGIONS } from './types'

describe('종교 데이터', () => {
  it('주요국 종교가 교과서 문화권과 맞다', () => {
    expect(getReligion('SA')).toBe('islam') // 사우디아라비아
    expect(getReligion('IN')).toBe('hindu') // 인도
    expect(getReligion('TH')).toBe('buddhist') // 타이
    expect(getReligion('IL')).toBe('jewish') // 이스라엘
    expect(getReligion('RU')).toBe('orthodox') // 러시아
    expect(getReligion('BR')).toBe('catholic') // 브라질(라틴아메리카)
    expect(getReligion('US')).toBe('protestant') // 미국(앵글로아메리카)
  })
  it('모든 종교값이 정의된 8분류 안에 있다', () => {
    const ids = new Set(RELIGIONS.map((r) => r.id))
    for (const v of Object.values(religionData)) expect(ids.has(v)).toBe(true)
  })
  it('100개국 이상 매핑돼 있다', () => {
    expect(Object.keys(religionData).length).toBeGreaterThan(100)
  })
})

describe('문화 상세 데이터', () => {
  it('대표국은 가옥·의복·음식·종교설명을 모두 갖는다', () => {
    for (const c of Object.values(cultureData)) {
      expect(c.housing).not.toBe('')
      expect(c.clothing).not.toBe('')
      expect(c.food).not.toBe('')
      expect(c.religionNote).not.toBe('')
    }
  })
  it('대한민국 문화 상세가 있다', () => {
    expect(getCulture('KR')).not.toBeNull()
  })
})

describe('축제 데이터', () => {
  it('교과서 대표 축제 6개가 있다', () => {
    expect(FESTIVALS).toHaveLength(6)
  })
  it('각 축제가 나라·시기·설명·연계 포인트를 갖는다', () => {
    for (const f of FESTIVALS) {
      expect(f.countryNameKo).not.toBe('')
      expect(f.season).not.toBe('')
      expect(f.description).not.toBe('')
      expect(f.linkPoint).not.toBe('')
    }
  })
  it('축제 나라가 종교 데이터와 이어진다', () => {
    const isos = FESTIVALS.map((f) => f.countryIso)
    expect(isos).toEqual(expect.arrayContaining(['SE', 'IN', 'BR', 'ES', 'TH', 'PE']))
  })
  it('모든 축제가 대표 사진(웹 최적화 webp)과 캡션을 갖는다', () => {
    for (const f of FESTIVALS) {
      const image = FESTIVAL_IMAGES[f.id]
      expect(image, `${f.id} 사진 누락`).toBeDefined()
      expect(image.src).toMatch(/_min\.webp$/)
      expect(image.cap).not.toBe('')
    }
  })
})
