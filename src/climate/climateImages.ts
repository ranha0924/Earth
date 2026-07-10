import type { ClimateId } from './subtypes'

// 기후별 식생·인간생활 사진 (Higgsfield nano-banana 생성, 다큐멘터리 톤).
// 외부 CDN(Higgsfield) 호스팅 — 배포된 사이트에서 브라우저가 직접 로드한다.
// 로딩 속도를 위해 원본 png 대신 웹 최적화 webp(_min)를 사용한다.
// 사진은 실제 촬영본이 아니라 AI가 그린 '이해용' 이미지이며, 캡션에 대표 지역을 병기한다.
const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ft7J99VZpqixI61Z0zxEss998y/'
const img = (stem: string) => `${BASE}${stem}_min.webp`

export interface ClimateImages {
  veg: string // 식생 사진
  vegCap: string // 식생 캡션(대표 지역)
  life: string // 인간생활 사진
  lifeCap: string // 인간생활 캡션(대표 지역)
}

export const CLIMATE_IMAGES: Record<ClimateId, ClimateImages> = {
  Af: {
    veg: img('hf_20260710_012708_dbef4508-1903-4fdb-95ff-456b403c9d41'), vegCap: '열대 우림(정글) · 아마존·콩고 분지',
    life: img('hf_20260710_012710_d25b2fc5-81b1-4868-a621-15341b7b2021'), lifeCap: '고상 가옥과 고무 농장 · 동남아시아',
  },
  Am: {
    veg: img('hf_20260710_012711_5dd623cd-8711-4294-b482-93a61a845aec'), vegCap: '계절풍림(열대 계절림)',
    life: img('hf_20260710_012713_01058c5c-ce89-4150-9a6d-78fce4319234'), lifeCap: '우기의 벼농사 · 동남·남아시아',
  },
  Aw: {
    veg: img('hf_20260710_012226_3e25d889-935d-4414-9050-a0829354bddb'), vegCap: '사바나 초원 · 동아프리카',
    life: img('hf_20260710_012227_951c14d9-4253-4bfd-b427-1a821415b83c'), lifeCap: '사파리 · 세렝게티(탄자니아)',
  },
  BS: {
    veg: img('hf_20260710_012714_f0f85b03-cb12-499c-b5a2-58262c1b3235'), vegCap: '스텝(짧은 풀 초원) · 몽골·중앙아시아',
    life: img('hf_20260710_012715_e92dc328-0a54-4690-b4e9-53ba5fbfd158'), lifeCap: '게르와 유목 · 몽골',
  },
  BW: {
    veg: img('hf_20260710_012717_81fbf04a-1b09-4840-99e0-b2f33e830320'), vegCap: '모래 사막 · 사하라',
    life: img('hf_20260710_012229_01c88dc7-6baa-49bc-b896-1af098a76ba7'), lifeCap: '오아시스와 낙타 대상 · 서아시아·북아프리카',
  },
  Cfa: {
    veg: img('hf_20260710_012718_a6088f72-0457-498f-9e76-5428d8620bd1'), vegCap: '온대 혼합림',
    life: img('hf_20260710_012719_35cf9011-b0c6-4920-9658-3e740865f128'), lifeCap: '벼농사 · 동아시아',
  },
  Cfb: {
    veg: img('hf_20260710_012721_b1eb3058-6937-4e15-acce-19cd3502fc6f'), vegCap: '혼합림과 목초지 · 서유럽',
    life: img('hf_20260710_012722_67a38a85-f27d-4f59-9778-3d53ab3b258e'), lifeCap: '낙농업 · 서유럽',
  },
  Cs: {
    veg: img('hf_20260710_012736_ff2f7fcb-aaeb-460f-bbd7-939927d896b8'), vegCap: '올리브·경엽수 · 지중해 연안',
    life: img('hf_20260710_012737_e6ea445a-97bd-4e5c-b281-9f2e23f1d65b'), lifeCap: '포도밭과 흰 가옥 · 지중해 연안',
  },
  Cw: {
    veg: img('hf_20260710_012740_b4300698-75ba-4a4c-8cfc-945df1a93921'), vegCap: '조엽수림(온대 혼합림)',
    life: img('hf_20260710_012741_42746377-2ead-450e-82bb-04558c868851'), lifeCap: '차 재배(다원) · 중국 남부',
  },
  Df: {
    veg: img('hf_20260710_012742_a5e197ef-5774-442b-abec-88e38cbea6c2'), vegCap: '타이가(침엽수림)',
    life: img('hf_20260710_012743_7b04485a-f4d5-4e01-bb60-da1187b2528d'), lifeCap: '통나무집·임업 · 북유럽·캐나다',
  },
  Dw: {
    veg: img('hf_20260710_012744_07394579-ebc6-4a62-8bf7-55ac0e8ba56a'), vegCap: '타이가 · 시베리아',
    life: img('hf_20260710_012745_16648863-f404-4a87-8367-7b8420675b0b'), lifeCap: '임업(벌목) · 시베리아·중국 동북부',
  },
  ET: {
    veg: img('hf_20260710_012747_53eea5ff-0049-4bde-9071-1ed7153c017c'), vegCap: '이끼·지의류 툰드라',
    life: img('hf_20260710_012748_1a066632-0eb7-479d-aa52-665d6ad6b521'), lifeCap: '순록 유목 · 북극권(사미족)',
  },
  EF: {
    veg: img('hf_20260710_012750_76aec4e9-f121-4d43-936a-779342bd727c'), vegCap: '빙설 지대 · 남극·그린란드 내륙',
    life: img('hf_20260710_012751_386a9879-cba5-4cd8-9c75-36676d1bf1bd'), lifeCap: '남극 과학 기지',
  },
  H: {
    veg: img('hf_20260710_012752_0b0e75ca-4d33-47f2-a53c-58d083556e33'), vegCap: '고도별 수직 식생 · 안데스',
    life: img('hf_20260710_012754_0f7fa7be-73c1-4c5b-a89a-988d4bc10a9e'), lifeCap: '계단식 밭과 라마 · 안데스',
  },
}
