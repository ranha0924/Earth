import raw from './featured.json'
import type { ClimateId } from './subtypes'

// 대표국(46) 상세 기후 — 기후 그래프용 월별 기온·강수 + 보유 기후 목록 + 설명. ISO_A2 키.
export interface FeaturedClimate {
  cityKo: string
  southern: boolean
  temps: number[] // 12개월 평균 기온(°C)
  precip: number[] // 12개월 강수량(mm)
  note: string
  climates: ClimateId[] // 그 나라에 나타나는 기후 전체
}

export const featuredClimate: Record<string, FeaturedClimate> = raw as Record<string, FeaturedClimate>

export function getFeaturedClimate(iso: string | null | undefined): FeaturedClimate | null {
  if (!iso) return null
  return featuredClimate[iso.toUpperCase()] ?? null
}
