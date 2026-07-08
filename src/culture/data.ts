import religionRaw from './religion.json'
import cultureRaw from './culture.json'
import type { CultureData, CultureInfo, ReligionId } from './types'

// ISO_A2 → 주요 종교 (지구본 색칠·범례 기준, 약 174개국)
export const religionData: Record<string, ReligionId> = religionRaw as Record<string, ReligionId>

// ISO_A2 → 전통 문화 상세 (대표국 46개)
export const cultureData: CultureData = cultureRaw as CultureData

export function getReligion(iso: string | null | undefined): ReligionId | null {
  if (!iso) return null
  return religionData[iso.toUpperCase()] ?? null
}

export function getCulture(iso: string | null | undefined): CultureInfo | null {
  if (!iso) return null
  return cultureData[iso.toUpperCase()] ?? null
}
