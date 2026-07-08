import { create } from 'zustand'
import type { ClimateGroup } from './climate/types'
import type { IssueId } from './environment/types'
import type { ReligionId } from './culture/types'

export type Mode = 'climate' | 'environment' | 'culture' | 'quiz'
export type EnvironmentTab = 'issues' | 'treaties'
export type CultureLayer = 'religion' | 'festival'

interface AppState {
  mode: Mode
  selectedIso: string | null
  climateFilter: ClimateGroup | null
  // 환경 모드
  environmentTab: EnvironmentTab
  activeIssue: IssueId | null
  // 문화 모드
  cultureLayer: CultureLayer
  religionFilter: ReligionId | null
  selectedFestival: string | null

  setMode: (m: Mode) => void
  selectCountry: (iso: string | null) => void
  setClimateFilter: (g: ClimateGroup | null) => void
  toggleClimateFilter: (g: ClimateGroup) => void
  setEnvironmentTab: (t: EnvironmentTab) => void
  setActiveIssue: (id: IssueId | null) => void
  setCultureLayer: (l: CultureLayer) => void
  toggleReligionFilter: (r: ReligionId) => void
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
  selectedFestival: null,

  setMode: (mode) => set({ mode, selectedIso: null }),
  selectCountry: (selectedIso) => set({ selectedIso }),
  setClimateFilter: (climateFilter) => set({ climateFilter }),
  toggleClimateFilter: (g) => set({ climateFilter: get().climateFilter === g ? null : g }),
  setEnvironmentTab: (environmentTab) => set({ environmentTab, selectedIso: null, activeIssue: null }),
  setActiveIssue: (activeIssue) => set({ activeIssue }),
  setCultureLayer: (cultureLayer) => set({ cultureLayer, selectedFestival: null, selectedIso: null }),
  toggleReligionFilter: (r) => set({ religionFilter: get().religionFilter === r ? null : r }),
  selectFestival: (selectedFestival) => set({ selectedFestival }),
}))
