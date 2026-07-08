import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAppStore } from './store'

vi.mock('./globe/GlobeView', () => ({ GlobeView: () => <div data-testid="globe" /> }))

import App from './App'

beforeEach(() => {
  useAppStore.setState({ mode: 'climate', selectedIso: null, climateFilter: null })
})

describe('App', () => {
  it('제목·모드 전환·범례·지구본을 렌더한다', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: '기후' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: '기후 범례' })).toBeInTheDocument()
    expect(screen.getByTestId('globe')).toBeInTheDocument()
  })
  it('나라가 선택되면 카드가 나타난다', () => {
    useAppStore.setState({ selectedIso: 'KR' })
    render(<App />)
    expect(screen.getByText('대한민국')).toBeInTheDocument()
  })
  it('환경 모드를 클릭하면 준비 중 안내가 나타난다', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: '환경' }))
    expect(screen.getByText(/준비 중/)).toBeInTheDocument()
  })
  it('기후 모드가 아니면 선택된 나라가 있어도 기후 카드가 나타나지 않는다', () => {
    useAppStore.setState({ mode: 'environment', selectedIso: 'KR' })
    render(<App />)
    expect(screen.queryByText('대한민국')).not.toBeInTheDocument()
  })
})
