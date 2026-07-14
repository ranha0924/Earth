// 문화 모드: 종교 분포 + 축제 + 전통 문화(가옥·의복·음식)

export type ReligionId =
  | 'catholic' | 'protestant' | 'orthodox'
  | 'islam' | 'hindu' | 'buddhist' | 'jewish' | 'other'

export interface ReligionInfo {
  id: ReligionId
  nameKo: string
  color: string // 지구본 면 채우기·범례 색 (빈티지 아틀라스 톤)
  overview: string // 개요 — 기원·경전·핵심 사상 한 줄
  architecture: string // 상징적 건축물
  lifestyle: string // 생활양식 — 음식·예배·축일·관습
  distribution: string // 주요 분포 지역
  linkPoint: string // 문화·기후 연계 시험 포인트
}

// 종교 8분류 — 지정 색은 빈티지 아틀라스 톤(채도 낮은 지도책 색, 범례·지구본 면 채우기 기준).
// 각 종교의 상징 건축물·생활양식·분포는 종교 상세 카드에서 보여 준다.
export const RELIGIONS: ReligionInfo[] = [
  {
    id: 'catholic',
    nameKo: '가톨릭교',
    color: '#7d6b93', // 머트 바이올렛
    overview:
      '예수 그리스도를 구세주로 믿는 크리스트교의 한 갈래로, 로마 교황을 중심으로 전 세계가 하나의 교회 조직을 이룬다.',
    architecture:
      '높은 첨탑과 스테인드글라스로 장식한 웅장한 성당(대성당). 십자가를 얹은 고딕 양식이 대표적이며, 미사와 성사가 이곳에서 이뤄진다.',
    lifestyle:
      '일요일 미사와 세례·고해 같은 성사를 중심으로 생활한다. 성탄절·부활절 등 교회력을 따르고, 성모 마리아와 성인을 공경하는 전통이 있다.',
    distribution: '남유럽·라틴아메리카·필리핀. 유럽의 식민 활동을 따라 아메리카 대부분으로 퍼졌다.',
    linkPoint:
      '유럽(에스파냐·포르투갈)의 진출로 라틴아메리카가 가톨릭 문화권이 되었다. 리우 카니발도 가톨릭 절기에서 비롯됐다.',
  },
  {
    id: 'protestant',
    nameKo: '개신교',
    color: '#6e8ca8', // 슬레이트 블루
    overview:
      '16세기 종교 개혁으로 가톨릭에서 갈라져 나온 크리스트교. 교황의 권위 대신 성경과 개인의 믿음을 강조한다.',
    architecture:
      '십자가와 뾰족한 첨탑을 올린 간결한 교회. 화려한 장식을 줄이고 목사의 설교(말씀)를 중심으로 한 예배당 구조가 특징이다.',
    lifestyle:
      '일요일 예배와 성경 읽기를 중시한다. 근면·절약을 강조하는 생활 윤리가 자리 잡았고, 성직자와 평신도의 구분이 약한 편이다.',
    distribution: '북서 유럽(영국·독일·북유럽)과 미국·캐나다·오세아니아.',
    linkPoint:
      '근면·절약을 강조한 개신교 윤리가 서유럽·앵글로아메리카의 산업화·자본주의 발달과 연결된다.',
  },
  {
    id: 'orthodox',
    nameKo: '정교회',
    color: '#c08a4b', // 번트 옥커
    overview:
      '1054년 동서 교회 분열로 갈라진 동방 크리스트교. 화려한 전례와 이콘(성화) 공경을 중시한다.',
    architecture:
      '양파 모양의 황금 돔과 이콘(성화)으로 화려하게 꾸민 정교회 성당. 러시아·그리스의 대성당이 대표적이다.',
    lifestyle:
      '이콘 앞에서 기도하며 오래된 전례 의식을 그대로 지킨다. 부활절을 가장 큰 축일로 삼고, 그 전 긴 금식 기간을 둔다.',
    distribution: '러시아·동유럽·발칸반도·그리스.',
    linkPoint:
      '크리스트교 문화권 안에서도 동유럽·러시아는 정교회, 남유럽은 가톨릭, 북서유럽은 개신교로 갈린다.',
  },
  {
    id: 'islam',
    nameKo: '이슬람교',
    color: '#5f8069', // 세이지 그린
    overview:
      '7세기 무함마드가 창시한 유일신 종교. 알라를 믿고 경전 쿠란을 따르며, 신 앞의 평등과 공동체(움마)를 강조한다.',
    architecture:
      '둥근 돔과 하늘로 솟은 첨탑(미너렛)을 갖춘 모스크(이슬람 사원). 우상 숭배를 금해 내부에 신상이 없고 기하학·아라베스크 무늬로 꾸민다.',
    lifestyle:
      '하루 다섯 번 메카를 향해 예배하고, 라마단 한 달 동안 낮에 금식한다. 돼지고기와 술을 금하며, 평생 한 번 메카 순례(하지)를 목표로 한다.',
    distribution: '서남아시아·중앙아시아·북아프리카와 동남아시아 일부(인도네시아·말레이시아).',
    linkPoint:
      '건조 기후의 유목·오아시스 농업 위에 이슬람교가 퍼졌다. 돼지고기 금기·긴 옷·라마단이 건조 문화권의 생활과 이어진다.',
  },
  {
    id: 'hindu',
    nameKo: '힌두교',
    color: '#c8a24b', // 골드 옥커
    overview:
      '고대 인도에서 자연스럽게 생겨난 다신교. 창시자가 따로 없으며, 윤회와 업(카르마)·카스트 제도와 깊이 얽혀 있다.',
    architecture:
      '수많은 신들의 상을 빽빽이 조각한 탑(고푸람)을 세운 힌두 사원. 신상 앞에서 꽃과 불을 바치며 예배한다.',
    lifestyle:
      '소를 신성하게 여겨 쇠고기를 먹지 않고, 갠지스강에서 목욕하며 몸을 정화한다. 카스트에 따라 생활하며 색의 축제 홀리, 빛의 축제 디왈리를 지낸다.',
    distribution: '인도·네팔 중심의 남부아시아.',
    linkPoint:
      '힌두교의 소 신성시·카스트가 인도 문화권의 생활을 규정한다. 대표 축제 홀리가 인도 문화권을 상징한다.',
  },
  {
    id: 'buddhist',
    nameKo: '불교',
    color: '#bd7350', // 테라코타
    overview:
      '기원전 6세기경 인도에서 석가모니(붓다)가 창시. 욕심을 버리는 수행으로 해탈(깨달음)에 이르는 것을 목표로 한다.',
    architecture:
      '부처의 사리를 모신 탑(불탑·스투파)과 불상을 안치한 사원(절). 동아시아의 목조 사찰, 동남아의 황금 파고다가 대표적이다.',
    lifestyle:
      '절에서 예불과 명상으로 마음을 닦고, 살생을 삼가 채식하는 승려가 많다. 자비와 절제를 강조하며 부처님 오신 날(연등) 등을 기린다.',
    distribution: '동아시아(한국·중국·일본)·동남아시아(타이·미얀마)·티베트.',
    linkPoint:
      '인도에서 생겨나 동아시아·동남아시아로 전파됐다. 유교·도교와 함께 동아시아 문화권을 이루는 바탕이 된다.',
  },
  {
    id: 'jewish',
    nameKo: '유대교',
    color: '#8f9aae', // 페일 블루그레이
    overview:
      '유일신을 믿는 가장 오래된 일신교의 하나. 유대인을 신이 택한 민족으로 믿으며 경전은 토라(구약)로, 크리스트교·이슬람교의 뿌리가 됐다.',
    architecture:
      '토라를 읽고 예배하는 회당(시나고그). 예루살렘 성전 터에 남은 통곡의 벽이 가장 중요한 성지다.',
    lifestyle:
      '금요일 저녁부터 토요일까지 안식일(사바트)을 지켜 일을 멈춘다. 율법에 맞는 정결한 음식(코셔)만 먹고 돼지고기를 금한다.',
    distribution: '이스라엘 중심. 오랜 세월 전 세계에 흩어져(디아스포라) 살아왔다.',
    linkPoint:
      '유대교 → 크리스트교 → 이슬람교로 이어지는 일신교의 뿌리. 서남아시아(팔레스타인)를 두고 이슬람 세계와 갈등을 겪는다.',
  },
  {
    id: 'other',
    nameKo: '기타·토속·무종교',
    color: '#a9a291', // 카키 그레이
    overview:
      '세계 종교로 묶기 어려운 토속(민간) 신앙과 유교·도교·신토 같은 전통 사상, 그리고 무종교를 함께 아우른 분류다.',
    architecture:
      '조상을 모시는 사당, 마을을 지키는 서낭당, 도교 사원, 일본의 신사(神社) 등 지역마다 형태가 다양하다.',
    lifestyle:
      '조상 숭배와 제례, 자연·정령을 섬기는 풍습이 생활 속에 남아 있다. 동아시아에서는 유교 예절과 명절 차례가 이어진다.',
    distribution: '동아시아(한국·중국·일본)와 사하라 이남 아프리카의 토속 신앙 등.',
    linkPoint:
      '동아시아 문화권은 특정 세계 종교보다 유교·불교·도교가 섞인 생활 문화가 바탕이 된다.',
  },
]

export function colorForReligion(id: ReligionId): string {
  return RELIGIONS.find((r) => r.id === id)?.color ?? '#9aa4bd'
}

export const RELIGION_BY_ID: Record<ReligionId, ReligionInfo> = Object.fromEntries(
  RELIGIONS.map((r) => [r.id, r]),
) as Record<ReligionId, ReligionInfo>

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
