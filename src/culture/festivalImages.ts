// 축제별 대표 사진 (Higgsfield nano-banana 생성, 다큐멘터리 톤).
// 외부 CDN(Higgsfield) 호스팅 — 배포된 사이트에서 브라우저가 직접 로드한다.
// 로딩 속도를 위해 원본 png 대신 웹 최적화 webp(_min)를 사용한다.
// 사진은 실제 촬영본이 아니라 AI가 그린 '이해용' 이미지이며, 캡션에 대표 장면·지역을 병기한다.
const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ft7J99VZpqixI61Z0zxEss998y/'
const img = (stem: string) => `${BASE}${stem}_min.webp`

export interface FestivalImage {
  src: string // 축제 사진
  cap: string // 캡션(대표 장면·지역)
}

// 축제 id → 대표 사진. festivals.ts의 FESTIVALS와 id가 일치한다.
export const FESTIVAL_IMAGES: Record<string, FestivalImage> = {
  midsommar: {
    src: img('hf_20260711_040807_09baf8c8-60f8-430d-a59c-04f0c717d3ba'),
    cap: '꽃기둥(마이스통) 둘레의 춤 · 스웨덴',
  },
  holi: {
    src: img('hf_20260711_040809_58fb2116-3569-477a-bfb5-8c08a32e6139'),
    cap: '색가루를 뿌리는 색의 축제 · 인도',
  },
  rio: {
    src: img('hf_20260711_040810_891321ff-89d0-46b3-8c70-341a33860ef6'),
    cap: '삼바 퍼레이드 · 브라질 리우',
  },
  tomatina: {
    src: img('hf_20260711_040812_3fc8c129-3f34-4d9a-98c4-39d8007e16cc'),
    cap: '토마토를 던지는 거리 · 에스파냐 부뇰',
  },
  songkran: {
    src: img('hf_20260711_040814_2ad1fc5b-6dc1-46d6-aa3d-a8169305c27c'),
    cap: '물을 뿌리는 물 축제 · 타이',
  },
  intiraymi: {
    src: img('hf_20260711_040816_40ae9bbd-a8ee-4deb-93de-2d6eed779986'),
    cap: '태양신 인티 숭배 의식 · 페루 쿠스코',
  },
}
