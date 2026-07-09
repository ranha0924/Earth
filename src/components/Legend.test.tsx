import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Legend } from './Legend'
import { useAppStore } from '../store'

beforeEach(() => {
  useAppStore.setState({ mode: 'climate', selectedIso: null, climateFilter: null })
})

describe('Legend', () => {
  it('14개 기후 소분류를 버튼으로 보여준다', () => {
    render(<Legend />)
    for (const label of ['열대우림', '열대몬순', '사바나', '스텝', '사막', '지중해성', '냉대습윤', '툰드라', '고산']) {
      expect(screen.getByRole('button', { name: new RegExp(label) })).toBeInTheDocument()
    }
  })
  it('6개 대분류 헤더를 표시한다', () => {
    const { container } = render(<Legend />)
    const heads = Array.from(container.querySelectorAll('.legend__group-name')).map((e) => e.textContent)
    expect(heads).toEqual(['열대', '건조', '온대', '냉대', '한대', '고산'])
  })
  it('소분류 클릭 시 스토어 필터가 그 소분류로 설정된다', async () => {
    render(<Legend />)
    await userEvent.click(screen.getByRole('button', { name: /지중해성/ }))
    expect(useAppStore.getState().climateFilter).toBe('지중해성')
  })
  it('활성 항목만 aria-pressed=true', () => {
    useAppStore.setState({ climateFilter: '사바나' })
    render(<Legend />)
    expect(screen.getByRole('button', { name: /사바나/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /툰드라/ })).toHaveAttribute('aria-pressed', 'false')
  })
})
