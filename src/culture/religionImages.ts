// 종교별 대표 사진 (Higgsfield nano-banana 생성, 다큐멘터리 톤).
// 각 종교의 상징적 건축물(성당·모스크·사원 등)을 중심 장면으로 담았다.
// 외부 CDN(Higgsfield) 호스팅 — 배포된 사이트에서 브라우저가 직접 로드한다.
// 로딩 속도를 위해 원본 png 대신 웹 최적화 webp(_min)를 사용한다.
// 사진은 실제 촬영본이 아니라 AI가 그린 '이해용' 이미지이며, 캡션에 대표 장면·건축물을 병기한다.
import type { ReligionId } from './types'

const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ft7J99VZpqixI61Z0zxEss998y/'
const img = (stem: string) => `${BASE}${stem}_min.webp`

export interface ReligionImage {
  src: string // 종교 대표 사진 (상징 건축물)
  cap: string // 캡션(대표 장면·건축물)
}

// 종교 id → 대표 사진. types.ts의 RELIGIONS와 id가 일치한다(Record라 8개 모두 필수).
export const RELIGION_IMAGES: Record<ReligionId, ReligionImage> = {
  catholic: {
    src: img('hf_20260714_005141_205b6716-5c9b-47b2-9b97-9807dae87265'),
    cap: '고딕 대성당과 옛 도시 광장 · 유럽',
  },
  protestant: {
    src: img('hf_20260714_005432_bc9fb0c6-df0f-48e9-ba56-af41c9d8bacc'),
    cap: '첨탑을 올린 흰 교회 · 북유럽 마을',
  },
  orthodox: {
    src: img('hf_20260714_005435_e5cb0728-bb73-4141-b2c7-f3a5dfb431a4'),
    cap: '황금 양파 돔의 정교회 성당 · 러시아',
  },
  islam: {
    src: img('hf_20260714_005436_3988ba4b-765d-4fe0-9b5f-42eee18b9290'),
    cap: '돔과 첨탑(미너렛)을 갖춘 모스크 · 서남아시아',
  },
  hindu: {
    src: img('hf_20260714_005438_c834ffdd-bc48-46be-81c7-b893ac9068a0'),
    cap: '신상을 조각한 고푸람 사원 · 남인도',
  },
  buddhist: {
    src: img('hf_20260714_005440_85cb0824-e484-4078-8d69-f5eebc84d66d'),
    cap: '황금 불탑과 승려들 · 동남아시아',
  },
  jewish: {
    src: img('hf_20260714_005441_996edca0-09cd-4b05-9ecd-b685aaaacb7c'),
    cap: '통곡의 벽에서의 기도 · 예루살렘',
  },
  other: {
    src: img('hf_20260714_005443_1c678a12-80c1-4742-bc71-06de519be5a8'),
    cap: '숲속 신사·사당과 제례 · 동아시아',
  },
}
