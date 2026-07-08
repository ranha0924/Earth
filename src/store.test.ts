import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from './store'

beforeEach(() => {
  useAppStore.setState({ mode: 'climate', selectedIso: null, climateFilter: null })
})

describe('useAppStore', () => {
  it('기본 모드는 climate', () => {
    expect(useAppStore.getState().mode).toBe('climate')
  })
  it('setMode로 모드를 바꾼다', () => {
    useAppStore.getState().setMode('quiz')
    expect(useAppStore.getState().mode).toBe('quiz')
  })
  it('selectCountry로 선택 나라를 설정/해제한다', () => {
    useAppStore.getState().selectCountry('KR')
    expect(useAppStore.getState().selectedIso).toBe('KR')
    useAppStore.getState().selectCountry(null)
    expect(useAppStore.getState().selectedIso).toBeNull()
  })
  it('toggleClimateFilter는 같은 그룹을 두 번 누르면 해제된다', () => {
    useAppStore.getState().toggleClimateFilter('온대')
    expect(useAppStore.getState().climateFilter).toBe('온대')
    useAppStore.getState().toggleClimateFilter('온대')
    expect(useAppStore.getState().climateFilter).toBeNull()
  })
})
