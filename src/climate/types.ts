export type ClimateGroup = '열대' | '건조' | '온대' | '냉대' | '한대' | '고산'

export interface CountryClimate {
  nameKo: string
  nameEn: string
  group: ClimateGroup
  subtype: string
  note?: string
}

export type ClimateData = Record<string, CountryClimate>

// 대분류 6개와 지정 색(Global Constraints와 일치). 범례·텍스처 색 기준.
export const CLIMATE_GROUPS: { group: ClimateGroup; color: string }[] = [
  { group: '열대', color: '#1b7837' },
  { group: '건조', color: '#f2c744' },
  { group: '온대', color: '#91cf60' },
  { group: '냉대', color: '#4575b4' },
  { group: '한대', color: '#d9d9d9' },
  { group: '고산', color: '#8c6bb1' },
]

export function colorForGroup(group: ClimateGroup): string {
  const found = CLIMATE_GROUPS.find((g) => g.group === group)
  return found ? found.color : '#999999'
}
