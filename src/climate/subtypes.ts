import type { ClimateGroup } from './types'

// 쾨펜 기호(ClimateId) → 한국어 소분류명 + 대분류(색상 그룹)
export type ClimateId =
  | 'Af' | 'Am' | 'Aw'
  | 'BS' | 'BW'
  | 'Cfa' | 'Cfb' | 'Cs' | 'Cw'
  | 'Df' | 'Dw'
  | 'ET' | 'EF'
  | 'H'

export const SUBTYPE: Record<ClimateId, { ko: string; group: ClimateGroup }> = {
  Af: { ko: '열대우림', group: '열대' },
  Am: { ko: '열대몬순', group: '열대' },
  Aw: { ko: '사바나', group: '열대' },
  BS: { ko: '스텝', group: '건조' },
  BW: { ko: '사막', group: '건조' },
  Cfa: { ko: '온난습윤', group: '온대' },
  Cfb: { ko: '서안해양성', group: '온대' },
  Cs: { ko: '지중해성', group: '온대' },
  Cw: { ko: '온대겨울건조', group: '온대' },
  Df: { ko: '냉대습윤', group: '냉대' },
  Dw: { ko: '냉대겨울건조', group: '냉대' },
  ET: { ko: '툰드라', group: '한대' },
  EF: { ko: '빙설', group: '한대' },
  H: { ko: '고산', group: '고산' },
}
