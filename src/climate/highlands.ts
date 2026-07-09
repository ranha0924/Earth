// 고산 기후는 나라 단위가 아니라 지역(고원·산지) 현상 — 지구본에 오버레이 핀으로 표시
export interface Highland {
  id: string
  nameKo: string
  lat: number
  lng: number
  cities: string
  note: string
}

export const HIGHLANDS: Highland[] = [
  {
    id: 'andes',
    nameKo: '안데스 산지',
    lat: -13.5,
    lng: -72,
    cities: '키토(에콰도르)·쿠스코(페루)·라파스(볼리비아)',
    note: '적도 부근이지만 해발 2,800~4,000m라 일 년 내내 봄처럼 서늘한 상춘 기후. 잉카 문명이 번성했고 지금도 고산 도시가 발달해 있다. 같은 페루라도 해안은 사막, 동부는 열대 우림이라 "고산은 나라가 아니라 지역"임을 보여 준다.',
  },
  {
    id: 'tibet',
    nameKo: '티베트 고원',
    lat: 32,
    lng: 88,
    cities: '라싸(중국 티베트)',
    note: '평균 해발 4,500m의 "세계의 지붕". 여름에도 서늘하며 야크 사육과 고산 유목이 이루어진다.',
  },
  {
    id: 'ethiopia',
    nameKo: '에티오피아 고원',
    lat: 9.5,
    lng: 38.9,
    cities: '아디스아바바(에티오피아)',
    note: '적도와 가깝지만 해발 2,000m 이상이라 연중 온화하다. 서늘한 고원에서 커피 재배가 발달했다(커피의 원산지).',
  },
  {
    id: 'mexico',
    nameKo: '멕시코 고원',
    lat: 22,
    lng: -102,
    cities: '멕시코시티(멕시코)',
    note: '해발 2,200m의 고원에 자리한 멕시코시티는 저위도인데도 연중 온화하다. 고대 아스텍 문명의 중심지였다.',
  },
]

export const HIGHLAND_BY_ID: Record<string, Highland> = Object.fromEntries(
  HIGHLANDS.map((h) => [h.id, h]),
)
