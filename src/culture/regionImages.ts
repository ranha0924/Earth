// 문화권별 대표 사진 (Higgsfield nano-banana 생성, 다큐멘터리 톤).
// 외부 CDN(Higgsfield) 호스팅 — 배포된 사이트에서 브라우저가 직접 로드한다.
// 로딩 속도를 위해 원본 png 대신 웹 최적화 webp(_min)를 사용한다.
// 사진은 실제 촬영본이 아니라 AI가 그린 '이해용' 이미지이며, 캡션에 대표 장면·지역을 병기한다.
import type { RegionId } from './regions'

const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ft7J99VZpqixI61Z0zxEss998y/'
const img = (stem: string) => `${BASE}${stem}_min.webp`

export interface RegionImage {
  src: string // 문화권 대표 사진
  cap: string // 캡션(대표 장면·지역)
}

// 문화권 id → 대표 사진. regions.ts의 REGIONS와 id가 일치한다(Record라 9개 모두 필수).
export const REGION_IMAGES: Record<RegionId, RegionImage> = {
  eastasia: {
    src: img('hf_20260711_050237_3716f751-941d-4ec4-b8e1-8bf1865fabd4'),
    cap: '전통 사원과 계단식 논 · 동아시아',
  },
  southeastasia: {
    src: img('hf_20260711_050122_c9329ba4-57fa-4c5f-bff5-1e114fa3e0e2'),
    cap: '수상 가옥과 불교 사원 · 동남아시아',
  },
  southasia: {
    src: img('hf_20260711_050124_22d10d0d-025c-4dd7-82ec-e8cee21ab888'),
    cap: '갠지스강의 힌두교 의식 · 인도',
  },
  dryislam: {
    src: img('hf_20260711_050125_06eb83c6-a0df-44c5-a074-94aee33e35fe'),
    cap: '사막의 모스크와 오아시스 · 서남아시아·북아프리카',
  },
  europe: {
    src: img('hf_20260711_050127_9a2814db-f67f-42e1-8acc-023c124c51bf'),
    cap: '대성당이 있는 옛 도시 · 유럽',
  },
  africa: {
    src: img('hf_20260711_050129_33d4ff83-6edf-4273-8072-eb3129e161d2'),
    cap: '초원의 전통 마을 · 사하라 이남 아프리카',
  },
  angloamerica: {
    src: img('hf_20260711_050131_0a77cddd-ecec-4682-9d5a-00aa3a10b12f'),
    cap: '고층 빌딩의 대도시 · 미국·캐나다',
  },
  latinamerica: {
    src: img('hf_20260711_050132_f292b731-d7e4-4561-be10-e303dd7cdb64'),
    cap: '가톨릭 성당과 축제 · 라틴아메리카',
  },
  oceania: {
    src: img('hf_20260711_050135_76bc9148-cba1-4500-98c1-81be53e81be8'),
    cap: '해안 도시와 원주민 문화 · 오세아니아',
  },
}
