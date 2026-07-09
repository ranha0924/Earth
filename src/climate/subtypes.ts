import type { ClimateGroup } from './types'

// 쾨펜 기호(ClimateId) → 한국어 소분류명 + 대분류(그룹) + 지도 색(통합사회 관례 팔레트)
export type ClimateId =
  | 'Af' | 'Am' | 'Aw'
  | 'BS' | 'BW'
  | 'Cfa' | 'Cfb' | 'Cs' | 'Cw'
  | 'Df' | 'Dw'
  | 'ET' | 'EF'
  | 'H'

export interface SubtypeInfo {
  ko: string
  group: ClimateGroup
  color: string
  hatch?: boolean // 고산: 색 대신 사선 해칭
}

export const SUBTYPE: Record<ClimateId, SubtypeInfo> = {
  Af: { ko: '열대우림', group: '열대', color: '#d64b3f' }, // 빨강
  Am: { ko: '열대몬순', group: '열대', color: '#e6892f' }, // 주황
  Aw: { ko: '사바나', group: '열대', color: '#ecc94b' }, // 노랑
  BS: { ko: '스텝', group: '건조', color: '#e3d6a8' }, // 모래
  BW: { ko: '사막', group: '건조', color: '#caa24a' }, // 황토
  Cfa: { ko: '온난습윤', group: '온대', color: '#2f7d46' }, // 찐초록
  Cfb: { ko: '서안해양성', group: '온대', color: '#62ac5e' }, // 초록
  Cs: { ko: '지중해성', group: '온대', color: '#a6dcc6' }, // 연민트
  Cw: { ko: '온대겨울건조', group: '온대', color: '#b9d16b' }, // 연두
  Df: { ko: '냉대습윤', group: '냉대', color: '#aad4ea' }, // 연하늘
  Dw: { ko: '냉대겨울건조', group: '냉대', color: '#64abda' }, // 하늘
  ET: { ko: '툰드라', group: '한대', color: '#c3b3e0' }, // 라벤더
  EF: { ko: '빙설', group: '한대', color: '#8a6fc2' }, // 찐라벤더
  H: { ko: '고산', group: '고산', color: '#93748a', hatch: true }, // 빗금
}

// 한국어 소분류명 → 정보 (climate.json의 subtype 문자열로 조회)
export const SUBTYPE_BY_KO: Record<string, SubtypeInfo> = Object.fromEntries(
  Object.values(SUBTYPE).map((s) => [s.ko, s]),
)

// 범례용: 대분류별로 묶은 소분류 목록
export const SUBTYPE_GROUPS: { group: ClimateGroup; items: SubtypeInfo[] }[] = (() => {
  const order: ClimateGroup[] = ['열대', '건조', '온대', '냉대', '한대', '고산']
  return order.map((group) => ({
    group,
    items: Object.values(SUBTYPE).filter((s) => s.group === group),
  }))
})()

export function colorForSubtypeKo(ko: string | undefined): string | null {
  if (!ko) return null
  return SUBTYPE_BY_KO[ko]?.color ?? null
}
