import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Legend } from './Legend'
import { useAppStore } from '../store'

beforeEach(() => {
  useAppStore.setState({ mode: 'climate', selectedIso: null, climateFilter: null })
})

describe('Legend', () => {
  it('6개 기후 대분류 라벨을 모두 텍스트로 보여준다', () => {
    render(<Legend />)
    for (const label of ['열대', '건조', '온대', '냉대', '한대', '고산']) {
      expect(screen.getByRole('button', { name: new RegExp(label) })).toBeInTheDocument()
    }
  })
  it('항목 클릭 시 스토어 필터가 설정된다', async () => {
    render(<Legend />)
    await userEvent.click(screen.getByRole('button', { name: /온대/ }))
    expect(useAppStore.getState().climateFilter).toBe('온대')
  })
  it('활성 항목은 aria-pressed=true', () => {
    useAppStore.setState({ climateFilter: '건조' })
    render(<Legend />)
    expect(screen.getByRole('button', { name: /건조/ })).toHaveAttribute('aria-pressed', 'true')
  })
})
