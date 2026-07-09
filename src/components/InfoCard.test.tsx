import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InfoCard } from './InfoCard'
import { useAppStore } from '../store'

beforeEach(() => {
  useAppStore.setState({ mode: 'climate', selectedIso: null, climateFilter: null })
})

describe('InfoCard', () => {
  it('선택된 나라가 없으면 아무것도 렌더하지 않는다', () => {
    const { container } = render(<InfoCard />)
    expect(container).toBeEmptyDOMElement()
  })
  it('데이터가 있는 나라는 이름과 기후를 보여준다', () => {
    useAppStore.setState({ selectedIso: 'KR' })
    const { container } = render(<InfoCard />)
    expect(screen.getByText('대한민국')).toBeInTheDocument()
    expect(screen.getByText(/냉대 · 냉대습윤/)).toBeInTheDocument()
    // 대표국은 기후 그래프(서울)와 기후 설명이 함께 표시된다
    expect(screen.getByText(/서울의 기온·강수량/)).toBeInTheDocument()
    const swatch = container.querySelector('.card__swatch')
    expect(swatch?.getAttribute('aria-hidden')).toBe('true')
  })
  it('데이터가 없는 나라는 준비 중 안내를 보여준다', () => {
    useAppStore.setState({ selectedIso: 'ZZ' })
    render(<InfoCard />)
    expect(screen.getByText(/준비 중/)).toBeInTheDocument()
  })
  it('닫기 버튼은 선택을 해제한다', async () => {
    useAppStore.setState({ selectedIso: 'KR' })
    render(<InfoCard />)
    await userEvent.click(screen.getByRole('button', { name: /닫기/ }))
    expect(useAppStore.getState().selectedIso).toBeNull()
  })
})
