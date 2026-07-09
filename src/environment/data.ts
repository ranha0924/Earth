import type { Issue, IssueId, Treaty, TreatyId } from './types'

export const ISSUES: Issue[] = [
  {
    id: 'acid-rain',
    nameKo: '산성비',
    icon: '🌧️',
    cause:
      '공장·자동차·화력 발전소에서 나오는 황산화물(SOx)과 질소산화물(NOx)이 대기 중에서 물과 반응해 강한 산성을 띤 비가 된다.',
    phenomenon: 'pH 5.6 미만의 산성을 띤 비·눈·안개가 내린다.',
    effect:
      '삼림이 말라 죽고 토양과 호수가 산성화되어 물고기가 사라진다. 대리석 건축물과 석조 문화재를 부식시킨다.',
    solution:
      '탈황·탈질 장치 설치와 청정에너지 전환. 오염 물질이 바람을 타고 국경을 넘으므로 주변국 간 협력이 필요하다.',
    treaties: [],
    regions: [
      { nameKo: '서·중부 유럽', lat: 50, lng: 9 },
      { nameKo: '동아시아(한·중·일)', lat: 35, lng: 120 },
      { nameKo: '북아메리카 동부', lat: 43, lng: -78 },
    ],
    countryIsos: ['DE', 'GB', 'CN', 'KR', 'JP', 'US'],
  },
  {
    id: 'ozone',
    nameKo: '오존층 파괴',
    icon: '🕳️',
    cause:
      '냉장고·에어컨 냉매와 스프레이에 쓰이던 염화플루오린화탄소(CFC, 프레온가스)가 성층권 오존층을 파괴한다.',
    phenomenon: '성층권 오존층이 얇아지고, 특히 남극 상공에 오존 구멍(오존홀)이 나타난다.',
    effect:
      '자외선이 지표에 많이 도달해 피부암·백내장이 늘고 생태계가 교란된다.',
    solution:
      '프레온가스 사용 규제와 대체 물질 개발. 몬트리올 의정서로 국제 사회가 성공적으로 대응한 대표 사례다.',
    treaties: ['montreal'],
    regions: [{ nameKo: '남극 상공 오존홀', lat: -82, lng: 0 }],
    countryIsos: [],
  },
  {
    id: 'deforestation',
    nameKo: '열대림 파괴',
    icon: '🪓',
    cause:
      '목재 수출, 농경지·목장 개간, 광산·도로 개발, 팜유 플랜테이션을 위해 열대 우림을 대규모로 벌목·소각한다.',
    phenomenon: '"지구의 허파"라 불리는 열대 우림이 빠르게 사라진다.',
    effect:
      '이산화 탄소 흡수량이 줄어 지구 온난화가 심해지고, 수많은 동식물의 서식지가 사라져 생물 다양성이 감소한다.',
    solution: '지속 가능한 삼림 관리, 보호 구역 지정, 열대림 국가에 대한 국제적 지원.',
    treaties: ['cbd', 'unfccc'],
    regions: [
      { nameKo: '아마존 분지', lat: -3, lng: -62 },
      { nameKo: '콩고 분지', lat: 0, lng: 22 },
      { nameKo: '동남아시아(보르네오)', lat: 0.5, lng: 114 },
    ],
    countryIsos: ['BR', 'CD', 'ID'],
  },
  {
    id: 'desertification',
    nameKo: '사막화',
    icon: '🏜️',
    cause:
      '오랜 가뭄 등 기후 변화에 더해, 과도한 방목·경작·삼림 벌채 같은 인간 활동으로 토양이 황폐해진다.',
    phenomenon: '초원·농경지가 사막처럼 메마른 땅으로 변한다.',
    effect:
      '농경지와 목초지가 줄어 식량이 부족해지고, 물과 땅을 둘러싼 난민·분쟁이 발생한다. 황사·모래 폭풍도 심해진다.',
    solution:
      '나무 심기(녹색 장성)와 지속 가능한 토지 이용. 사막화 방지 협약(UNCCD)으로 국제 사회가 함께 대응한다.',
    treaties: ['unccd'],
    regions: [
      { nameKo: '사헬 지대(사하라 남쪽)', lat: 15, lng: 5 },
      { nameKo: '중앙아시아(아랄해 주변)', lat: 45, lng: 60 },
      { nameKo: '중국 내륙·고비 사막', lat: 42, lng: 105 },
    ],
    countryIsos: ['ML', 'NE', 'MN', 'CN'],
  },
  {
    id: 'fine-dust',
    nameKo: '미세 먼지',
    icon: '😷',
    cause:
      '공장·자동차·화력 발전에서 나오는 매연과 사막의 흙먼지(황사)가 대기를 떠다닌다. 지름 10μm 이하(미세)·2.5μm 이하(초미세)의 작은 입자다.',
    phenomenon: '하늘이 뿌옇게 흐려지고 공기 질이 나빠진다.',
    effect:
      '호흡기·심혈관 질환을 일으키고 가시거리를 떨어뜨린다. 편서풍을 타고 국경을 넘어 이웃 나라에도 피해를 준다.',
    solution:
      '배출 규제, 친환경차 보급, 청정에너지 전환. 발생원이 국경을 넘으므로 주변국 간 공동 대응이 중요하다.',
    treaties: [],
    regions: [
      { nameKo: '동아시아(한·중)', lat: 36, lng: 118 },
      { nameKo: '남아시아(인도 북부)', lat: 28, lng: 77 },
    ],
    countryIsos: ['CN', 'KR', 'IN', 'MN'],
  },
  {
    id: 'marine',
    nameKo: '해양 오염',
    icon: '🛢️',
    cause:
      '유조선 사고로 인한 기름 유출, 육지에서 흘러든 생활·산업 폐수, 바다에 버려지는 각종 쓰레기가 원인이다.',
    phenomenon: '바다가 기름·오염 물질·쓰레기로 더러워진다.',
    effect:
      '바닷새와 물고기가 죽고 해양 생태계가 파괴된다. 오염된 수산물을 통해 사람에게도 피해가 돌아온다.',
    solution: '폐기물 해양 투기 금지(런던 협약), 유류 유출 방제, 오염원 관리.',
    treaties: ['london'],
    regions: [
      { nameKo: '태평양 거대 쓰레기 지대', lat: 32, lng: -145 },
      { nameKo: '연안 오염(동아시아)', lat: 34, lng: 125 },
    ],
    countryIsos: [],
  },
  {
    id: 'microplastic',
    nameKo: '미세 플라스틱',
    icon: '🧴',
    cause:
      '바다로 흘러든 플라스틱 쓰레기가 잘게 부서지거나(2차), 세안제·화장품에 든 작은 알갱이(1차)가 바다로 유입된다. 크기 5mm 이하의 작은 플라스틱이다.',
    phenomenon: '눈에 잘 안 보이는 작은 플라스틱 조각이 바다 곳곳에 퍼진다.',
    effect:
      '물고기가 먹이로 착각해 삼키고, 먹이 사슬을 따라 이동해 결국 사람의 식탁(수산물·소금)에까지 올라온다.',
    solution: '플라스틱 사용 줄이기, 재활용 확대, 미세 플라스틱 함유 제품 규제.',
    treaties: ['london'],
    regions: [{ nameKo: '태평양 거대 쓰레기 지대', lat: 32, lng: -145 }],
    countryIsos: [],
  },
]

export const TREATIES: Treaty[] = [
  {
    id: 'ramsar',
    nameKo: '람사르 협약',
    year: 1971,
    target: '습지 보전',
    keyword: '습지·물새 서식지',
    summary:
      '물새 서식지로서 국제적으로 중요한 습지를 보호하기 위한 협약. 이란의 람사르에서 채택되었다. 우리나라의 순천만, 우포늪 등이 람사르 습지로 등록되어 있다.',
    confusion: '습지 하면 람사르! "물새·갯벌·늪"이 나오면 람사르 협약.',
    host: { iso: 'IR', placeKo: '이란 람사르' },
  },
  {
    id: 'london',
    nameKo: '런던 협약',
    year: 1972,
    target: '해양 오염(폐기물 투기)',
    keyword: '폐기물 해양 투기 금지',
    summary:
      '폐기물을 바다에 버려(투기) 발생하는 해양 오염을 막기 위한 협약. 육상에서 생긴 쓰레기·오니 등을 바다에 버리는 행위를 규제한다.',
    confusion: '런던(바다에 버리는 것) vs 바젤(나라 밖으로 옮기는 것) 구분 주의.',
    host: { iso: 'GB', placeKo: '영국 런던' },
  },
  {
    id: 'montreal',
    nameKo: '몬트리올 의정서',
    year: 1987,
    target: '오존층 파괴',
    keyword: '염화플루오린화탄소(프레온가스) 규제',
    summary:
      '오존층을 파괴하는 염화플루오린화탄소(CFC, 프레온가스) 등의 생산·사용을 규제하기 위한 의정서. 오존층 보호를 위한 비엔나 협약(1985)의 실천 방안으로 채택되었다.',
    confusion: '오존층 = 몬트리올 의정서. 프레온가스(냉매·스프레이)가 키워드.',
    host: { iso: 'CA', placeKo: '캐나다 몬트리올' },
  },
  {
    id: 'basel',
    nameKo: '바젤 협약',
    year: 1989,
    target: '유해 폐기물 이동',
    keyword: '유해 폐기물의 국가 간 이동 규제',
    summary:
      '유해 폐기물이 국경을 넘어 다른 나라(특히 개발도상국)로 옮겨져 처리되는 것을 규제하는 협약. 선진국이 유해 쓰레기를 가난한 나라에 떠넘기는 것을 막는다.',
    confusion: '바젤(유해 폐기물의 국가 간 이동) vs 런던(폐기물 해양 투기) 구분 필수.',
    host: { iso: 'CH', placeKo: '스위스 바젤' },
  },
  {
    id: 'unfccc',
    nameKo: '기후 변화 협약',
    year: 1992,
    target: '지구 온난화',
    keyword: '온실가스·기후 변화 대응 기본 틀',
    summary:
      '지구 온난화에 대응하기 위한 기본 틀을 마련한 협약. 1992년 브라질 리우 회의에서 채택되었다. 이후 교토 의정서·파리 협정으로 구체화된다.',
    confusion: '기후변화협약(1992·기본 틀) → 교토(1997·선진국 의무) → 파리(2015·모든 국가)의 출발점.',
    lineage: 'climate',
    host: { iso: 'BR', placeKo: '브라질 리우데자네이루' },
  },
  {
    id: 'cbd',
    nameKo: '생물 다양성 협약',
    year: 1992,
    target: '생물 다양성 보전',
    keyword: '생물종·유전자원 보호',
    summary:
      '지구의 생물 다양성을 보전하고 생물 자원을 지속 가능하게 이용하기 위한 협약. 기후변화협약과 함께 1992년 리우 회의에서 채택되었다.',
    confusion: '"생물종 감소·유전자원" 하면 생물 다양성 협약. 리우 회의(1992) 산물.',
    host: { iso: 'BR', placeKo: '브라질 리우데자네이루' },
  },
  {
    id: 'unccd',
    nameKo: '사막화 방지 협약',
    year: 1994,
    target: '사막화',
    keyword: '사막화 방지·토지 황폐화',
    summary:
      '가뭄과 사막화로 어려움을 겪는 지역, 특히 아프리카를 돕기 위한 협약. 무리한 개발·방목으로 인한 토지 황폐화(사막화)를 막는 것을 목표로 한다.',
    confusion: '사막화 = 사막화 방지 협약(UNCCD). 사헬 지대·아프리카가 키워드.',
    host: { iso: 'FR', placeKo: '프랑스 파리 (채택)' },
  },
  {
    id: 'kyoto',
    nameKo: '교토 의정서',
    year: 1997,
    target: '온실가스 감축',
    keyword: '선진국의 온실가스 감축 의무',
    summary:
      '기후변화협약을 구체화해 온실가스 감축 목표를 처음으로 정한 의정서. 주로 선진국에 감축 의무를 부과했으며, 탄소 배출권 거래제 등을 도입했다.',
    confusion: '교토(선진국만 의무) vs 파리(모든 당사국 자율 목표) 차이가 최다 출제 포인트.',
    lineage: 'climate',
    host: { iso: 'JP', placeKo: '일본 교토' },
  },
  {
    id: 'paris',
    nameKo: '파리 협정',
    year: 2015,
    target: '온실가스 감축(신기후체제)',
    keyword: '모든 당사국 참여·1.5~2°C 억제',
    summary:
      '교토 의정서를 대체하는 신기후체제. 선진국과 개발도상국을 포함한 모든 당사국이 각자 온실가스 감축 목표(NDC)를 정해 참여한다. 산업화 이전 대비 지구 평균 기온 상승을 2°C보다 훨씬 아래, 가능하면 1.5°C로 억제하는 것을 목표로 한다.',
    confusion: '파리 협정 = "모든 나라"가 참여. 교토(선진국 의무)와의 차이를 반드시 기억.',
    lineage: 'climate',
    host: { iso: 'FR', placeKo: '프랑스 파리' },
  },
]

export const ISSUE_BY_ID: Record<IssueId, Issue> = Object.fromEntries(
  ISSUES.map((i) => [i.id, i]),
) as Record<IssueId, Issue>

export const TREATY_BY_ID: Record<TreatyId, Treaty> = Object.fromEntries(
  TREATIES.map((t) => [t.id, t]),
) as Record<TreatyId, Treaty>
