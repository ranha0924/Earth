export type ClimateGroup = '열대' | '건조' | '온대' | '냉대' | '한대' | '고산'

export interface CountryClimate {
  nameKo: string
  nameEn: string
  group: ClimateGroup
  subtype: string
  note?: string
  /** 교과서·기준에 따라 대분류가 갈리는 나라의 분류 주의 안내(예: 한국 온대/냉대). 있으면 카드에 '분류 포인트'로 표시. */
  classNote?: string
}

export type ClimateData = Record<string, CountryClimate>

// 대분류 6개 지정 색. 빈티지 아틀라스 톤 — 채도 낮은 지도책 색. 범례·지구본 면 채우기 기준.
export const CLIMATE_GROUPS: { group: ClimateGroup; color: string }[] = [
  { group: '열대', color: '#5f7052' }, // 세이지 그린
  { group: '건조', color: '#c8a24b' }, // 황토/옥색
  { group: '온대', color: '#9aa76a' }, // 연올리브
  { group: '냉대', color: '#6e8ca8' }, // 슬레이트 블루
  { group: '한대', color: '#bcc3c0' }, // 페일 그레이블루
  { group: '고산', color: '#93748a' }, // 머트 플럼
]

export function colorForGroup(group: ClimateGroup): string {
  const found = CLIMATE_GROUPS.find((g) => g.group === group)
  return found ? found.color : '#999999'
}
