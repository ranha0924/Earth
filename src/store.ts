import { create } from 'zustand'
import type { IssueId } from './environment/types'
import type { ReligionId } from './culture/types'
import type { RegionId } from './culture/regions'

export type Mode = 'climate' | 'environment' | 'culture' | 'quiz'
export type EnvironmentTab = 'issues' | 'treaties'
export type CultureLayer = 'religion' | 'festival' | 'region'

interface AppState {
  mode: Mode
  selectedIso: string | null
  climateFilter: string | null // 소분류 한국어명 (예: '지중해성')
  // 환경 모드
  environmentTab: EnvironmentTab
  activeIssue: IssueId | null
  // 문화 모드
  cultureLayer: CultureLayer
  religionFilter: ReligionId | null
  regionFilter: RegionId | null
  selectedFestival: string | null

  setMode: (m: Mode) => void
  selectCountry: (iso: string | null) => void
  setClimateFilter: (g: string | null) => void
  toggleClimateFilter: (g: string) => void
  setEnvironmentTab: (t: EnvironmentTab) => void
  setActiveIssue: (id: IssueId | null) => void
  setCultureLayer: (l: CultureLayer) => void
  toggleReligionFilter: (r: ReligionId) => void
  toggleRegionFilter: (r: RegionId) => void
  selectFestival: (id: string | null) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  mode: 'climate',
  selectedIso: null,
  climateFilter: null,
  environmentTab: 'issues',
  activeIssue: null,
  cultureLayer: 'religion',
  religionFilter: null,
  regionFilter: null,
  selectedFestival: null,

  setMode: (mode) => set({ mode, selectedIso: null }),
  selectCountry: (selectedIso) => set({ selectedIso }),
  setClimateFilter: (climateFilter) => set({ climateFilter }),
  toggleClimateFilter: (g) => set({ climateFilter: get().climateFilter === g ? null : g }),
  setEnvironmentTab: (environmentTab) => set({ environmentTab, selectedIso: null, activeIssue: null }),
  setActiveIssue: (activeIssue) => set({ activeIssue }),
  // 레이어를 바꾸면 이전 레이어의 선택·필터를 정리한다.
  setCultureLayer: (cultureLayer) =>
    set({ cultureLayer, selectedFestival: null, selectedIso: null, religionFilter: null, regionFilter: null }),
  // 종교 범례를 켜면 선택 나라를 비워, 나라 문화 카드 대신 종교 상세 카드가 뜨게 한다.
  toggleReligionFilter: (r) =>
    set(get().religionFilter === r ? { religionFilter: null } : { religionFilter: r, selectedIso: null }),
  // 문화권 범례도 같은 원리 — 켜면 선택 나라를 비워, 누른 문화권이 카드·지구본에 함께 반영되게 한다.
  toggleRegionFilter: (r) =>
    set(get().regionFilter === r ? { regionFilter: null } : { regionFilter: r, selectedIso: null }),
  selectFestival: (selectedFestival) => set({ selectedFestival }),
}))
