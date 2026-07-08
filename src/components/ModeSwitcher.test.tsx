import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModeSwitcher } from './ModeSwitcher'
import { useAppStore } from '../store'

beforeEach(() => {
  useAppStore.setState({ mode: 'climate', selectedIso: null, climateFilter: null })
})

describe('ModeSwitcher', () => {
  it('4개 모드 버튼을 보여준다', () => {
    render(<ModeSwitcher />)
    for (const label of ['기후', '환경', '문화', '퀴즈']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })
  it('현재 모드 버튼은 aria-pressed=true', () => {
    render(<ModeSwitcher />)
    expect(screen.getByRole('button', { name: '기후' })).toHaveAttribute('aria-pressed', 'true')
  })
  it('버튼 클릭 시 모드가 바뀐다', async () => {
    render(<ModeSwitcher />)
    await userEvent.click(screen.getByRole('button', { name: '퀴즈' }))
    expect(useAppStore.getState().mode).toBe('quiz')
  })
})
