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

// 색상 = 필립스 세계 지도(2021) 범례에서 추출 — 통합사회 교과서 기준
export const SUBTYPE: Record<ClimateId, SubtypeInfo> = {
  Af: { ko: '열대우림', group: '열대', color: '#e23b2c' }, // 빨강
  Am: { ko: '열대몬순', group: '열대', color: '#ef8b34' }, // 주황
  Aw: { ko: '사바나', group: '열대', color: '#f4d13c' }, // 노랑
  BS: { ko: '스텝', group: '건조', color: '#ece3c4' }, // 옅은 모래
  BW: { ko: '사막', group: '건조', color: '#d6af5a' }, // 황토
  Cfa: { ko: '온난습윤', group: '온대', color: '#367a31' }, // 진초록
  Cfb: { ko: '서안해양성', group: '온대', color: '#77b04c' }, // 초록
  Cs: { ko: '지중해성', group: '온대', color: '#b6cd61' }, // 연녹색
  Cw: { ko: '온대겨울건조', group: '온대', color: '#9dc44d' }, // 연두
  Df: { ko: '냉대습윤', group: '냉대', color: '#a8dedb' }, // 옅은 청록
  Dw: { ko: '냉대겨울건조', group: '냉대', color: '#67c4c6' }, // 청록
  ET: { ko: '툰드라', group: '한대', color: '#cbbde0' }, // 옅은 보라
  EF: { ko: '빙설', group: '한대', color: '#9d80c5' }, // 보라
  H: { ko: '고산', group: '고산', color: '#444444', hatch: true }, // 검은 빗금
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
