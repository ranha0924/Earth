// 환경 모드: 환경문제 + 국제협약

export type IssueId =
  | 'acid-rain' | 'ozone' | 'deforestation' | 'desertification'
  | 'fine-dust' | 'marine' | 'microplastic'

export type TreatyId =
  | 'ramsar' | 'london' | 'montreal' | 'basel' | 'unfccc'
  | 'cbd' | 'unccd' | 'kyoto' | 'paris'

export interface IssueRegion {
  nameKo: string
  lat: number
  lng: number
}

export interface Issue {
  id: IssueId
  nameKo: string
  icon: string
  cause: string
  phenomenon: string
  effect: string
  solution: string
  treaties: TreatyId[] // 비어 있으면 "직접 대응 협약 없음"
  regions: IssueRegion[]
  countryIsos: string[] // ISO_A2 대문자 — 지구본 하이라이트
}

export interface Treaty {
  id: TreatyId
  nameKo: string
  year: number
  target: string
  keyword: string
  summary: string
  confusion?: string
  lineage?: 'climate' // 기후변화협약→교토→파리 계보
}
