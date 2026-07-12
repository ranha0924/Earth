import raw from './countryNames.json'

interface NamePair {
  ko: string
  en: string
}

const NAMES: Record<string, NamePair> = raw as Record<string, NamePair>

export interface CountryEntry {
  iso: string
  ko: string
  en: string
}

/** 이름이 있는 전체 나라 목록(한국어명 가나다순) — 나라 검색(키보드 선택)용. */
export const COUNTRY_LIST: CountryEntry[] = Object.entries(NAMES)
  .map(([iso, n]) => ({ iso, ko: n.ko, en: n.en }))
  .sort((a, b) => a.ko.localeCompare(b.ko, 'ko'))

/** ISO_A2 → 한국어 국가명. 없으면 ISO 코드 그대로 반환. */
export function countryNameKo(iso: string | null | undefined): string {
  if (!iso) return ''
  return NAMES[iso.toUpperCase()]?.ko ?? iso
}

export function countryNameEn(iso: string | null | undefined): string {
  if (!iso) return ''
  return NAMES[iso.toUpperCase()]?.en ?? ''
}

export function hasCountryName(iso: string | null | undefined): boolean {
  return !!iso && iso.toUpperCase() in NAMES
}
