import type { Festival } from './types'

// 교과서 대표 축제 6개 — 지구본에 핀으로 표시
export const FESTIVALS: Festival[] = [
  {
    id: 'midsommar',
    nameKo: '하지 축제 (미드소마르)',
    countryIso: 'SE',
    countryNameKo: '스웨덴',
    lat: 59.33,
    lng: 18.07,
    season: '6월 하지 무렵',
    description:
      '일 년 중 낮이 가장 긴 하지를 기념하는 북유럽의 대표 축제. 꽃으로 장식한 기둥(마이스통) 둘레에서 춤추고 노래하며, 밤에도 해가 지지 않는 백야를 즐긴다.',
    linkPoint:
      '고위도 지방은 여름에 밤에도 해가 지지 않는 백야가 나타난다. 긴 겨울을 견딘 뒤 짧고 소중한 여름 햇빛을 반기는 문화.',
  },
  {
    id: 'holi',
    nameKo: '홀리 축제',
    countryIso: 'IN',
    countryNameKo: '인도',
    lat: 28.61,
    lng: 77.21,
    season: '3월 봄맞이',
    description:
      '봄의 시작과 풍요를 기원하며 서로에게 색색의 가루(물감)를 뿌리는 힌두교의 축제. 신분과 나이를 넘어 함께 즐기는 "색의 축제"로 유명하다.',
    linkPoint:
      '힌두교 문화권(인도)의 대표 축제. 겨울이 끝나고 봄이 오는 계절 변화와 풍년을 비는 농경 문화와 연결된다.',
  },
  {
    id: 'rio',
    nameKo: '리우 카니발',
    countryIso: 'BR',
    countryNameKo: '브라질',
    lat: -22.91,
    lng: -43.17,
    season: '2월 사순절 직전',
    description:
      '삼바 리듬에 맞춰 화려한 의상을 입고 퍼레이드를 벌이는 세계 최대 규모의 축제. 원래 가톨릭의 금욕 기간(사순절)에 앞서 즐기던 축제에서 비롯되었다.',
    linkPoint:
      '유럽(가톨릭) 문화와 아프리카 문화가 뒤섞인 라틴 아메리카의 문화 융합을 보여 준다. 남반구라 2월이 한여름이다.',
  },
  {
    id: 'tomatina',
    nameKo: '부뇰 토마토 축제 (라 토마티나)',
    countryIso: 'ES',
    countryNameKo: '에스파냐',
    lat: 39.42,
    lng: -0.79,
    season: '8월 마지막 수요일',
    description:
      '에스파냐 부뇰 마을에서 수많은 사람이 잘 익은 토마토를 서로에게 던지며 즐기는 이색 축제. 거리가 온통 토마토로 붉게 물든다.',
    linkPoint:
      '지중해성 기후에서 여름에 잘 자라는 토마토를 소재로 한 축제. 지중해 연안의 풍부한 채소·과일 농업과 이어진다.',
  },
  {
    id: 'songkran',
    nameKo: '송끄란 축제',
    countryIso: 'TH',
    countryNameKo: '타이',
    lat: 13.75,
    lng: 100.5,
    season: '4월 타이 설날',
    description:
      '타이의 전통 설날을 맞아 서로에게 물을 뿌리며 축복하는 물 축제. 물로 지난해의 나쁜 기운을 씻어 내고 새해의 복을 빈다.',
    linkPoint:
      '일 년 중 가장 더운 건기 끝 무렵(4월)에 열려 더위를 식히는 의미도 있다. 불교 문화권 타이의 대표 축제.',
  },
  {
    id: 'intiraymi',
    nameKo: '태양제 (인티 라이미)',
    countryIso: 'PE',
    countryNameKo: '페루',
    lat: -13.52,
    lng: -71.97,
    season: '6월 24일 동지',
    description:
      '옛 잉카 제국의 수도 쿠스코에서 태양신(인티)에게 감사를 올리는 축제. 남반구의 동지에 맞춰 태양이 다시 길어지기를 기원한다.',
    linkPoint:
      '안데스 고산 지대에서 번성한 잉카 문명의 태양 숭배 전통. 남반구라 6월이 겨울(동지)이라는 점이 핵심.',
  },
]

export const FESTIVAL_BY_ID: Record<string, Festival> = Object.fromEntries(
  FESTIVALS.map((f) => [f.id, f]),
)
