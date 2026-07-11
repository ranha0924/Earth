// 세계 문화권 (통합사회 '문화와 다양성') — 지구본 색칠·범례·상세 카드 기준.
// 종교·언어·생활 양식이 비슷해 하나로 묶이는 지역을 9개 문화권으로 구분한다.

export type RegionId =
  | 'eastasia'
  | 'southeastasia'
  | 'southasia'
  | 'dryislam'
  | 'europe'
  | 'africa'
  | 'angloamerica'
  | 'latinamerica'
  | 'oceania'

export interface CultureRegion {
  id: RegionId
  nameKo: string
  color: string // 지구본 면 채우기·범례 색 (빈티지 아틀라스 톤)
  area: string // 대표 범위
  religion: string // 주요 종교·사상
  language: string // 주요 언어·문자
  traits: string // 문화 특징
  linkPoint: string // 기후·환경 연계 시험 포인트
}

// 9개 문화권 지정 색 — 종교 팔레트와 겹치지 않는 채도 낮은 지도책 색.
export const REGIONS: CultureRegion[] = [
  {
    id: 'eastasia',
    nameKo: '동아시아 문화권',
    color: '#c14b39', // 주칠 레드
    area: '한국·중국·일본·몽골·타이완',
    religion: '유교·불교·도교',
    language: '한자(漢字) 문화 · 한국어·중국어·일본어',
    traits:
      '한자·유교·불교를 함께 나눠 온 문화권. 젓가락을 쓰고 벼농사를 지으며, 조상 숭배와 공동체·예(禮)를 중시한다.',
    linkPoint:
      '계절풍(몬순) 기후에 맞춘 벼농사 → 쌀·젓가락 중심 식문화. 한자와 유교라는 공통 요소로 묶인다.',
  },
  {
    id: 'southeastasia',
    nameKo: '동남아시아 문화권',
    color: '#5e8f6a', // 세이지 그린
    area: '베트남·타이·인도네시아·필리핀·말레이시아 등',
    religion: '불교·이슬람교·크리스트교가 공존',
    language: '베트남어·타이어·말레이어 등 다양',
    traits:
      '인도양과 태평양을 잇는 길목이라 인도·중국·이슬람·유럽 문화가 겹쳐 다양성이 크다. 벼농사와 플랜테이션 농업이 발달하고, 고온 다습한 기후에 맞춘 고상 가옥이 많다.',
    linkPoint:
      '열대(계절풍) 기후 → 벼농사·플랜테이션. 동서 교류의 길목이라 여러 종교·문화가 뒤섞였다.',
  },
  {
    id: 'southasia',
    nameKo: '인도(남부아시아) 문화권',
    color: '#d59a3b', // 사프란 오렌지
    area: '인도·파키스탄·방글라데시·네팔·스리랑카',
    religion: '힌두교 중심 (불교·이슬람교 발상·공존)',
    language: '힌디어 등 다양한 언어 · 산스크리트 전통',
    traits:
      '힌두교와 카스트 제도의 영향이 크고, 불교가 처음 생겨난 지역이다. 갠지스강을 신성시하며 소를 귀히 여겨 쇠고기를 잘 먹지 않는다. 다양한 언어·민족이 공존한다.',
    linkPoint:
      '힌두교 문화(카스트·소 신성시)와 계절풍 기후의 벼·밀 농사가 연결된다. 색의 축제 홀리가 대표.',
  },
  {
    id: 'dryislam',
    nameKo: '건조(이슬람) 문화권',
    color: '#b89152', // 카키 샌드
    area: '서남아시아·중앙아시아·북아프리카',
    religion: '이슬람교 (쿠란·모스크)',
    language: '아랍어 중심',
    traits:
      '이슬람교와 아랍어로 묶이는 문화권. 건조 기후에 맞춰 오아시스 농업과 유목이 발달했고, 흙벽돌집과 온몸을 가리는 헐렁한 옷이 특징이다. 돼지고기를 금기시하고 라마단 금식을 지킨다.',
    linkPoint:
      '건조 기후 → 유목·오아시스 농업, 햇볕·모래를 막는 긴 옷. 이슬람교(돼지고기 금기·라마단)로 통합된다.',
  },
  {
    id: 'europe',
    nameKo: '유럽 문화권',
    color: '#5577a0', // 슬레이트 블루
    area: '유럽 전역·러시아',
    religion: '크리스트교 (가톨릭·개신교·정교회)',
    language: '인도·유럽어족 (영어·라틴어·게르만·슬라브 계열)',
    traits:
      '크리스트교를 바탕으로 하며 북서부(개신교)·남부(가톨릭·라틴)·동부(정교회·슬라브)로 세분된다. 산업혁명이 시작된 지역으로 근대 문물이 세계로 퍼졌다.',
    linkPoint:
      '온대(서안 해양성·지중해성) 기후 위에 크리스트교 문화. 종교·언어에 따라 북서·남·동유럽으로 나뉜다.',
  },
  {
    id: 'africa',
    nameKo: '아프리카 문화권',
    color: '#8f5a3c', // 번트 브라운
    area: '사하라 이남 아프리카',
    religion: '토속 신앙 + 이슬람교·크리스트교',
    language: '부족별 다양한 언어 (스와힐리어 등)',
    traits:
      '사하라 이남의 문화권으로 부족 단위 공동체와 토속 신앙이 강하다. 유럽 식민 지배의 영향으로 언어·종교가 복잡하게 섞였고, 부족·언어의 다양성이 매우 크다.',
    linkPoint:
      '열대(사바나)·건조 기후 위의 부족 중심 사회. 유럽 식민 지배로 국경과 언어가 인위적으로 나뉘었다.',
  },
  {
    id: 'angloamerica',
    nameKo: '앵글로아메리카 문화권',
    color: '#7a6a9e', // 머트 바이올렛
    area: '미국·캐나다',
    religion: '개신교 중심 (여러 종교 공존)',
    language: '영어',
    traits:
      '영어와 개신교를 바탕으로 한 이민 사회. 유럽(특히 영국) 문화가 이식되었고 산업화·도시화가 일찍 진행되었다. 여러 민족이 어울리는 다문화 사회다.',
    linkPoint:
      '앵글로색슨(영어·개신교) 문화가 이식됨. 리오그란데강을 경계로 라틴아메리카와 문화가 갈린다.',
  },
  {
    id: 'latinamerica',
    nameKo: '라틴아메리카 문화권',
    color: '#b45f77', // 더스티 로즈
    area: '멕시코 이남 중·남아메리카',
    religion: '가톨릭교',
    language: '에스파냐어·포르투갈어(브라질)',
    traits:
      '남유럽(에스파냐·포르투갈)의 가톨릭·언어가 원주민·아프리카 문화와 섞인 혼합 문화권. 메스티소·물라토 등 혼혈이 많고, 유럽과 아프리카 문화가 융합된 축제(리우 카니발)가 발달했다.',
    linkPoint:
      '유럽(가톨릭)+원주민+아프리카 문화의 융합. 리우 카니발이 대표이며, 리오그란데강이 앵글로아메리카와의 경계.',
  },
  {
    id: 'oceania',
    nameKo: '오세아니아 문화권',
    color: '#4b8c88', // 틸
    area: '오스트레일리아·뉴질랜드·태평양 도서',
    religion: '개신교 (원주민 전통 신앙)',
    language: '영어 (원주민 언어)',
    traits:
      '유럽(영국) 문화가 이식된 오스트레일리아·뉴질랜드와, 원주민(애버리지니·마오리) 및 태평양 도서 문화가 공존한다. 남반구에 있어 계절이 북반구와 반대다.',
    linkPoint:
      '영국 문화 이식 + 원주민(애버리지니·마오리) 문화. 남반구라 계절이 북반구와 반대다.',
  },
]

export const REGION_BY_ID: Record<RegionId, CultureRegion> = Object.fromEntries(
  REGIONS.map((r) => [r.id, r]),
) as Record<RegionId, CultureRegion>

export function colorForRegion(id: RegionId): string {
  return REGION_BY_ID[id]?.color ?? '#a9a291'
}

export const REGION_LABEL: Record<RegionId, string> = Object.fromEntries(
  REGIONS.map((r) => [r.id, r.nameKo]),
) as Record<RegionId, string>

// 문화권별 소속 국가 (ISO_A2). religion.json과 같은 175개국 기준으로 채웠다.
// 그린란드(GL)·포클랜드(FK)·프랑스령 남방(TF) 등 애매한 소수는 비워 둔다(중립 육지).
const REGION_ISOS: Record<RegionId, string[]> = {
  eastasia: ['CN', 'JP', 'KR', 'KP', 'MN', 'TW'],
  southeastasia: ['VN', 'TH', 'LA', 'KH', 'MM', 'MY', 'SG', 'ID', 'PH', 'BN', 'TL'],
  southasia: ['IN', 'PK', 'BD', 'NP', 'LK', 'BT'],
  dryislam: [
    'SA', 'IR', 'IQ', 'TR', 'SY', 'JO', 'LB', 'IL', 'PS', 'KW', 'QA', 'AE', 'OM', 'YE', 'AZ',
    'KZ', 'UZ', 'TM', 'TJ', 'KG', 'AF',
    'EG', 'LY', 'TN', 'DZ', 'MA', 'SD', 'EH', 'MR',
  ],
  europe: [
    'GB', 'IE', 'FR', 'DE', 'NL', 'BE', 'LU', 'CH', 'AT', 'ES', 'PT', 'IT', 'GR', 'CY', 'MT',
    'SE', 'NO', 'FI', 'DK', 'IS', 'EE', 'LV', 'LT',
    'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'RS', 'BA', 'ME', 'MK', 'AL', 'XK',
    'BY', 'UA', 'MD', 'RU', 'GE', 'AM',
  ],
  africa: [
    'NG', 'ET', 'KE', 'TZ', 'UG', 'GH', 'CI', 'SN', 'ML', 'NE', 'TD', 'CM', 'CD', 'CG', 'GA',
    'GQ', 'AO', 'ZM', 'ZW', 'MZ', 'MW', 'RW', 'BI', 'SO', 'SS', 'ER', 'DJ', 'GN', 'GW', 'SL',
    'LR', 'TG', 'BJ', 'BF', 'GM', 'CF', 'NA', 'BW', 'ZA', 'LS', 'SZ', 'MG',
  ],
  angloamerica: ['US', 'CA'],
  latinamerica: [
    'MX', 'GT', 'BZ', 'HN', 'SV', 'NI', 'CR', 'PA', 'CU', 'DO', 'HT', 'JM', 'TT', 'BS', 'PR',
    'CO', 'VE', 'GY', 'SR', 'EC', 'PE', 'BO', 'BR', 'PY', 'UY', 'AR', 'CL',
  ],
  oceania: ['AU', 'NZ', 'PG', 'FJ', 'SB', 'VU', 'NC'],
}

// ISO_A2 → 문화권 (역참조 맵). 대문자 ISO 키.
export const REGION_BY_ISO: Record<string, RegionId> = Object.fromEntries(
  (Object.entries(REGION_ISOS) as [RegionId, string[]][]).flatMap(([id, isos]) =>
    isos.map((iso) => [iso, id]),
  ),
)

export function getRegion(iso: string | null | undefined): RegionId | null {
  if (!iso) return null
  return REGION_BY_ISO[iso.toUpperCase()] ?? null
}
