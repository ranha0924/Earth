import { useState } from 'react'
import { GlobeView } from './globe/GlobeView'
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
import { Icon } from './components/Icon'
import { useAppStore } from './store'

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
          <GlobeView />
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
                <h2 className="panel-head">문화 · 종교 · 축제</h2>
                <CultureControls />
              </div>
              <CultureCard />
            </>
          )}

          {mode === 'quiz' && <QuizMode />}
        </aside>
      </div>

      {showMatching && <MatchingGame onClose={() => setShowMatching(false)} />}
      {showCompare && <ClimateCompare onClose={() => setShowCompare(false)} />}
    </div>
  )
}
