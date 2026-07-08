import raw from './countryNames.json'

interface NamePair {
  ko: string
  en: string
}

const NAMES: Record<string, NamePair> = raw as Record<string, NamePair>

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
