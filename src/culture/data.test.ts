import { describe, it, expect } from 'vitest'
import { religionData, cultureData, getReligion, getCulture } from './data'
import { FESTIVALS } from './festivals'
import { FESTIVAL_IMAGES } from './festivalImages'
import { RELIGIONS } from './types'
import { REGIONS, getRegion, REGION_BY_ISO, REGION_BY_ID } from './regions'
import { REGION_IMAGES } from './regionImages'

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

describe('세계 문화권', () => {
  it('교과 9개 문화권이 있다', () => {
    expect(REGIONS).toHaveLength(9)
  })
  it('각 문화권이 색·범위·종교·언어·특징·연계 포인트를 갖는다', () => {
    for (const r of REGIONS) {
      expect(r.color, `${r.id} 색`).toMatch(/^#[0-9a-f]{6}$/i)
      expect(r.nameKo).not.toBe('')
      expect(r.area).not.toBe('')
      expect(r.religion).not.toBe('')
      expect(r.language).not.toBe('')
      expect(r.traits).not.toBe('')
      expect(r.linkPoint).not.toBe('')
    }
  })
  it('문화권 색이 서로 겹치지 않는다', () => {
    const colors = new Set(REGIONS.map((r) => r.color.toLowerCase()))
    expect(colors.size).toBe(REGIONS.length)
  })
  it('대표 나라가 교과 문화권과 맞다', () => {
    expect(getRegion('KR')).toBe('eastasia') // 대한민국
    expect(getRegion('TH')).toBe('southeastasia') // 타이
    expect(getRegion('IN')).toBe('southasia') // 인도
    expect(getRegion('SA')).toBe('dryislam') // 사우디아라비아
    expect(getRegion('FR')).toBe('europe') // 프랑스
    expect(getRegion('RU')).toBe('europe') // 러시아(유럽 문화권)
    expect(getRegion('EG')).toBe('dryislam') // 이집트(북아프리카=건조이슬람)
    expect(getRegion('NG')).toBe('africa') // 나이지리아
    expect(getRegion('US')).toBe('angloamerica') // 미국
    expect(getRegion('BR')).toBe('latinamerica') // 브라질
    expect(getRegion('AU')).toBe('oceania') // 오스트레일리아
  })
  it('매핑된 문화권 id가 모두 유효하다', () => {
    for (const id of Object.values(REGION_BY_ISO)) {
      expect(REGION_BY_ID[id]).toBeDefined()
    }
  })
  it('종교 데이터 국가의 대부분(≥170)에 문화권이 지정돼 있다', () => {
    const covered = Object.keys(religionData).filter((iso) => getRegion(iso) !== null)
    expect(covered.length).toBeGreaterThanOrEqual(170)
  })
  it('모든 문화권이 대표 사진(웹 최적화 webp)과 캡션을 갖는다', () => {
    for (const r of REGIONS) {
      const image = REGION_IMAGES[r.id]
      expect(image, `${r.id} 사진 누락`).toBeDefined()
      expect(image.src).toMatch(/_min\.webp$/)
      expect(image.cap).not.toBe('')
    }
  })
})
