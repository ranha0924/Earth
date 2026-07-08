import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAppStore } from './store'

vi.mock('./globe/GlobeView', () => ({ GlobeView: () => <div data-testid="globe" /> }))

import App from './App'

beforeEach(() => {
  useAppStore.setState({
    mode: 'climate',
    selectedIso: null,
    climateFilter: null,
    environmentTab: 'issues',
    activeIssue: null,
  })
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
  it('환경 모드를 클릭하면 환경문제 탭과 문제 칩이 나타난다', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('button', { name: '환경' }))
    expect(screen.getByRole('tab', { name: /환경문제/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /사막화/ })).toBeInTheDocument()
  })
  it('환경 모드에서는 기후 범례가 나타나지 않는다', () => {
    useAppStore.setState({ mode: 'environment' })
    render(<App />)
    expect(screen.queryByRole('group', { name: '기후 범례' })).not.toBeInTheDocument()
  })
  it('문화 모드에서는 종교 범례가 나타난다', () => {
    useAppStore.setState({ mode: 'culture' })
    render(<App />)
    expect(screen.getByRole('group', { name: '종교 범례' })).toBeInTheDocument()
  })
  it('퀴즈 모드에서는 퀴즈 카드(진행도)가 나타난다', () => {
    useAppStore.setState({ mode: 'quiz' })
    render(<App />)
    expect(screen.getByLabelText('퀴즈')).toBeInTheDocument()
  })
})
