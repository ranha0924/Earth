// 문화 모드: 종교 분포 + 축제 + 전통 문화(가옥·의복·음식)

export type ReligionId =
  | 'catholic' | 'protestant' | 'orthodox'
  | 'islam' | 'hindu' | 'buddhist' | 'jewish' | 'other'

export interface ReligionInfo {
  id: ReligionId
  nameKo: string
  color: string
}

// 종교 8분류 지정 색. 빈티지 아틀라스 톤 — 채도 낮은 지도책 색. 범례·지구본 면 채우기 기준.
export const RELIGIONS: ReligionInfo[] = [
  { id: 'catholic', nameKo: '가톨릭교', color: '#7d6b93' }, // 머트 바이올렛
  { id: 'protestant', nameKo: '개신교', color: '#6e8ca8' }, // 슬레이트 블루
  { id: 'orthodox', nameKo: '정교회', color: '#c08a4b' }, // 번트 옥커
  { id: 'islam', nameKo: '이슬람교', color: '#5f8069' }, // 세이지 그린
  { id: 'hindu', nameKo: '힌두교', color: '#c8a24b' }, // 골드 옥커
  { id: 'buddhist', nameKo: '불교', color: '#bd7350' }, // 테라코타
  { id: 'jewish', nameKo: '유대교', color: '#8f9aae' }, // 페일 블루그레이
  { id: 'other', nameKo: '기타·토속·무종교', color: '#a9a291' }, // 카키 그레이
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
