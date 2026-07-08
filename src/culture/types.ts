// 문화 모드: 종교 분포 + 축제 + 전통 문화(가옥·의복·음식)

export type ReligionId =
  | 'catholic' | 'protestant' | 'orthodox'
  | 'islam' | 'hindu' | 'buddhist' | 'jewish' | 'other'

export interface ReligionInfo {
  id: ReligionId
  nameKo: string
  color: string
}

// 종교 8분류와 지정 색. 범례·지구본 하이라이트 기준.
export const RELIGIONS: ReligionInfo[] = [
  { id: 'catholic', nameKo: '가톨릭교', color: '#7b6cf0' },
  { id: 'protestant', nameKo: '개신교', color: '#4cc9f0' },
  { id: 'orthodox', nameKo: '정교회', color: '#f0a04c' },
  { id: 'islam', nameKo: '이슬람교', color: '#2fb37a' },
  { id: 'hindu', nameKo: '힌두교', color: '#f0c04c' },
  { id: 'buddhist', nameKo: '불교', color: '#f0714c' },
  { id: 'jewish', nameKo: '유대교', color: '#8fa0c0' },
  { id: 'other', nameKo: '기타·토속·무종교', color: '#9aa4bd' },
]

export function colorForReligion(id: ReligionId): string {
  return RELIGIONS.find((r) => r.id === id)?.color ?? '#9aa4bd'
}

export const RELIGION_LABEL: Record<ReligionId, string> = Object.fromEntries(
  RELIGIONS.map((r) => [r.id, r.nameKo]),
) as Record<ReligionId, string>

export interface Festival {
  id: string
  nameKo: string
  countryIso: string
  countryNameKo: string
  lat: number
  lng: number
  season: string
  description: string
  linkPoint: string // 기후·문화 연계 시험 포인트
}

// 대표국 전통 문화 (가옥·의복·음식·종교) — 기후와 연결
export interface CultureInfo {
  religion: ReligionId
  housing: string
  clothing: string
  food: string
  religionNote: string
}

export type CultureData = Record<string, CultureInfo> // ISO_A2 → CultureInfo
