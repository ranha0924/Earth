import { useState, lazy, Suspense } from 'react'
import { ModeSwitcher } from './components/ModeSwitcher'
import { Legend } from './components/Legend'
import { InfoCard } from './components/InfoCard'
import { ClimateSubtypeCard } from './components/ClimateSubtypeCard'
import { EnvironmentControls } from './components/environment/EnvironmentControls'
import { EnvironmentCard } from './components/environment/EnvironmentCard'
import { MatchingGame } from './components/environment/MatchingGame'
import { ClimateCompare } from './components/ClimateCompare'
import { CultureControls } from './components/culture/CultureControls'
import { CultureCard } from './components/culture/CultureCard'
import { QuizMode } from './components/quiz/QuizMode'
import { CountryPicker } from './components/CountryPicker'
import { Icon } from './components/Icon'
import { useAppStore } from './store'

// 3D 엔진(globe.gl/three ~1.9MB)은 지연 로드 — 셸·범례가 먼저 뜨고 지구본은 뒤이어 스트리밍.
const GlobeView = lazy(() => import('./globe/GlobeView').then((m) => ({ default: m.GlobeView })))

const MODE_CAPTION: Record<string, string> = {
  climate: 'Fig. I — 세계 기후 구분도 (Köppen)',
  environment: 'Fig. II — 지구 환경 문제 분포도',
  culture: 'Fig. III — 세계 종교·문화 분포도',
  quiz: 'Plate IV — 학습 평가',
}

export default function App() {
  const mode = useAppStore((s) => s.mode)
  const environmentTab = useAppStore((s) => s.environmentTab)
  const [showMatching, setShowMatching] = useState(false)
  const [showCompare, setShowCompare] = useState(false)

  return (
    <div className="app">
      <header className="masthead">
        <div className="masthead__brand">
          <h1 className="masthead__title">세계 탐구 도감</h1>
          <p className="masthead__sub">Illustrated Atlas of the World · 통합사회</p>
        </div>
        <ModeSwitcher />
      </header>

      <div className="atlas">
        <div className="atlas__map">
          <Suspense fallback={<div className="globe-loading" role="status">지구본을 불러오는 중…</div>}>
            <GlobeView />
          </Suspense>
          <span className="ticks ticks--top" />
          <span className="ticks ticks--left" />
          <span className="crop crop--tl" />
          <span className="crop crop--tr" />
          <span className="crop crop--bl" />
          <span className="crop crop--br" />
          {mode === 'quiz' ? (
            <div className="map-caption quiz-hint">지도 문제는 지구본을 돌려 나라를 클릭하세요</div>
          ) : (
            <div className="map-caption">{MODE_CAPTION[mode]}</div>
          )}
        </div>

        <aside className="atlas__panel">
          {mode !== 'quiz' && (
            <div className="panel-section panel-section--search">
              <CountryPicker />
            </div>
          )}

          {mode === 'climate' && (
            <>
              <div className="panel-section">
                <h2 className="panel-head">기후 범례</h2>
                <Legend />
                <button type="button" className="matching-launch" onClick={() => setShowCompare(true)}>
                  <Icon name="globe" /> 기후 비교하기
                </button>
              </div>
              <ClimateSubtypeCard />
              <InfoCard />
            </>
          )}

          {mode === 'environment' && (
            <>
              <div className="panel-section">
                <h2 className="panel-head">환경 · 국제협약</h2>
                <EnvironmentControls />
                {environmentTab === 'treaties' && (
                  <button type="button" className="matching-launch" onClick={() => setShowMatching(true)}>
                    <Icon name="target" /> 협약 매칭 게임
                  </button>
                )}
              </div>
              <EnvironmentCard />
            </>
          )}

          {mode === 'culture' && (
            <>
              <div className="panel-section">
                <h2 className="panel-head">문화 · 종교 · 문화권 · 축제</h2>
                <CultureControls />
              </div>
              <CultureCard />
            </>
          )}

          {mode === 'quiz' && <QuizMode />}
        </aside>
      </div>

      <footer className="colophon" aria-label="자료 출처">
        <span className="colophon__label">자료 출처</span>
        <span className="colophon__item">
          기후 지도{' '}
          <a
            href="https://commons.wikimedia.org/wiki/File:K%C3%B6ppen-Geiger_Climate_Classification_Map_(1980%E2%80%932016)_no_borders.png"
            target="_blank"
            rel="noopener noreferrer"
          >
            Köppen-Geiger(Beck et al. 2018)
          </a>{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY-SA 4.0
          </a>
          <span className="colophon__note"> · 앱 색상으로 재채색(수정)함</span>
        </span>
        <span className="colophon__dot" aria-hidden="true">·</span>
        <span className="colophon__item">
          국경{' '}
          <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">
            Natural Earth
          </a>
          <span className="colophon__note"> · 퍼블릭 도메인</span>
        </span>
        <span className="colophon__dot" aria-hidden="true">·</span>
        <span className="colophon__item">
          대표 사진 <span className="colophon__note">AI 생성 · Higgsfield</span>
        </span>
      </footer>

      {showMatching && <MatchingGame onClose={() => setShowMatching(false)} />}
      {showCompare && <ClimateCompare onClose={() => setShowCompare(false)} />}
    </div>
  )
}
