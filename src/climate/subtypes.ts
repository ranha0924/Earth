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
  vegetation: string // 식생
  life: string // 인간생활(농업·주거·의복·관광 등)
}

// 색상 = 필립스 세계 지도(2021) 범례에서 추출 — 통합사회 교과서 기준
// vegetation/life = 통합사회 '자연환경과 인간' 단원의 기후별 식생·생활 모습
export const SUBTYPE: Record<ClimateId, SubtypeInfo> = {
  Af: {
    ko: '열대우림', group: '열대', color: '#e23b2c', // 빨강
    vegetation: '키 큰 상록활엽수가 빽빽한 밀림(정글). 남아메리카에서는 셀바스라고 부른다.',
    life: '전통적으로 숲을 태워 일구는 이동식 화전 농업을 했고, 오늘날에는 카카오·천연고무·기름야자를 대규모로 키우는 플랜테이션이 발달했다. 습기와 벌레를 피해 바닥을 띄운 고상 가옥에 살고, 열대림 생태 관광이 이루어진다.',
  },
  Am: {
    ko: '열대몬순', group: '열대', color: '#ef8b34', // 주황
    vegetation: '열대림에 건기 동안 잎을 떨구는 나무가 섞인 계절풍림.',
    life: '계절풍이 부는 우기에 강수가 집중되어 벼농사(2~3기작)가 활발하고, 차·사탕수수도 재배한다. 몬순이 농사와 생활 리듬을 좌우한다.',
  },
  Aw: {
    ko: '사바나', group: '열대', color: '#f4d13c', // 노랑
    vegetation: '키 큰 풀 초원에 나무가 드문드문 자라는 사바나. 바오바브·아카시아가 대표적이다.',
    life: '우기·건기가 뚜렷해 초식동물과 이를 노리는 야생동물이 많아 사파리 관광(세렝게티·마사이마라)이 발달했다. 커피·목화 플랜테이션과 가축 방목도 이루어진다.',
  },
  BS: {
    ko: '스텝', group: '건조', color: '#ece3c4', // 옅은 모래
    vegetation: '키 작은 풀이 자라는 짧은 초원(스텝).',
    life: '가축을 몰고 물과 풀을 찾아다니는 유목 생활을 하며, 몽골의 이동식 가옥 게르가 대표적이다. 물을 대면 밀도 재배하지만 과도한 방목으로 사막화 위험이 크다.',
  },
  BW: {
    ko: '사막', group: '건조', color: '#d6af5a', // 황토
    vegetation: '비가 거의 없어 식물이 자라지 못하고 오아시스 주변에만 자란다.',
    life: '오아시스와 관개 시설(카나트)에 기대어 대추야자·밀을 기르고 낙타 유목을 한다. 강한 햇빛·모래바람·수분 증발을 막으려 온몸을 감싸는 헐렁한 흰옷을 입고, 두꺼운 흙벽돌집에 산다.',
  },
  Cfa: {
    ko: '온난습윤', group: '온대', color: '#367a31', // 진초록
    vegetation: '상록활엽수와 낙엽활엽수가 섞인 혼합림.',
    life: '여름이 고온다습해 계절풍 지역(동아시아)에서는 벼농사가, 미국 남동부에서는 목화 재배가 발달했다. 인구가 밀집한 대도시가 많다.',
  },
  Cfb: {
    ko: '서안해양성', group: '온대', color: '#77b04c', // 초록
    vegetation: '혼합림과 넓은 목초지.',
    life: '편서풍과 난류의 영향으로 연중 온화·습윤해 곡물 재배와 가축 사육을 함께 하는 혼합 농업, 낙농업, 화훼(원예) 농업이 발달했다. 흐린 날이 많아 목초지가 넓다.',
  },
  Cs: {
    ko: '지중해성', group: '온대', color: '#b6cd61', // 연녹색
    vegetation: '여름 건조를 견디도록 잎이 두껍고 단단한 경엽수(올리브·코르크참나무).',
    life: '여름 건조에 강한 올리브·포도·오렌지 등 수목 농업과 와인 산업이 발달했다. 여름 햇빛을 막으려 벽을 희게 칠하고 창을 작게 낸 가옥에 살며, 맑은 날씨로 관광이 활발하다.',
  },
  Cw: {
    ko: '온대겨울건조', group: '온대', color: '#9dc44d', // 연두
    vegetation: '조엽수림 등 혼합림.',
    life: '여름에 집중되는 강수를 이용해 벼농사와 차 재배가 발달했다. 중국 남부·인도 북부가 대표적이다.',
  },
  Df: {
    ko: '냉대습윤', group: '냉대', color: '#a8dedb', // 옅은 청록
    vegetation: '침엽수림(타이가)과 남부의 혼합림.',
    life: '넓은 침엽수림을 바탕으로 임업·펄프·제지 산업이 발달했고, 짧은 여름에 감자·호밀·보리를 재배한다. 통나무집에 산다.',
  },
  Dw: {
    ko: '냉대겨울건조', group: '냉대', color: '#67c4c6', // 청록
    vegetation: '침엽수림(타이가).',
    life: '겨울이 매우 춥고 건조하며 연교차가 크다. 임업과 짧은 여름 밭농사가 이루어진다. 시베리아 동부·중국 동북부가 대표적이다.',
  },
  ET: {
    ko: '툰드라', group: '한대', color: '#cbbde0', // 옅은 보라
    vegetation: '나무가 자라지 못하고 짧은 여름에만 이끼·지의류가 자란다.',
    life: '순록을 기르는 유목(사미족)과 물범·물고기를 잡는 수렵·어로(이누이트)로 살아왔다. 땅속이 늘 언 영구 동토 위에 열이 새지 않도록 바닥을 띄운 고상 가옥을 짓는다.',
  },
  EF: {
    ko: '빙설', group: '한대', color: '#9d80c5', // 보라
    vegetation: '연중 눈과 얼음으로 덮여 식생이 거의 없다.',
    life: '사람이 정착하기 어려워 남극 세종·장보고 과학 기지처럼 연구·탐사 목적의 시설이 중심이다.',
  },
  H: {
    ko: '고산', group: '고산', color: '#444444', hatch: true, // 검은 빗금
    vegetation: '고도가 높아질수록 숲 → 풀밭 → 만년설로 식생이 수직으로 바뀐다.',
    life: '저위도 고산 지대는 연중 봄처럼 서늘한 상춘 기후라 키토·라파스·보고타 같은 고산 도시가 발달했다. 계단식 밭에서 감자·옥수수를 재배하고 라마·알파카를 방목하며, 판초와 챙 넓은 모자로 큰 일교차에 대응한다.',
  },
}

// 한국어 소분류명 → 정보 (climate.json의 subtype 문자열로 조회)
export const SUBTYPE_BY_KO: Record<string, SubtypeInfo> = Object.fromEntries(
  Object.values(SUBTYPE).map((s) => [s.ko, s]),
)

// 한국어 소분류명 → 쾨펜 기호(ClimateId)
export const ID_BY_KO: Record<string, ClimateId> = Object.fromEntries(
  (Object.entries(SUBTYPE) as [ClimateId, SubtypeInfo][]).map(([id, s]) => [s.ko, id]),
) as Record<string, ClimateId>

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
