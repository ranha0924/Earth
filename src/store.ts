import { create } from 'zustand'
import type { ClimateGroup } from './climate/types'

export type Mode = 'climate' | 'environment' | 'culture' | 'quiz'

interface AppState {
  mode: Mode
  selectedIso: string | null
  climateFilter: ClimateGroup | null
  setMode: (m: Mode) => void
  selectCountry: (iso: string | null) => void
  setClimateFilter: (g: ClimateGroup | null) => void
  toggleClimateFilter: (g: ClimateGroup) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  mode: 'climate',
  selectedIso: null,
  climateFilter: null,
  setMode: (mode) => set({ mode }),
  selectCountry: (selectedIso) => set({ selectedIso }),
  setClimateFilter: (climateFilter) => set({ climateFilter }),
  toggleClimateFilter: (g) =>
    set({ climateFilter: get().climateFilter === g ? null : g }),
}))
