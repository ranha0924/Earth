import { useState } from 'react'
import { GlobeView } from './globe/GlobeView'
import { ModeSwitcher } from './components/ModeSwitcher'
import { Legend } from './components/Legend'
import { InfoCard } from './components/InfoCard'
import { EnvironmentControls } from './components/environment/EnvironmentControls'
import { EnvironmentCard } from './components/environment/EnvironmentCard'
import { MatchingGame } from './components/environment/MatchingGame'
import { CultureControls } from './components/culture/CultureControls'
import { CultureCard } from './components/culture/CultureCard'
import { QuizMode } from './components/quiz/QuizMode'
import { useAppStore } from './store'

export default function App() {
  const mode = useAppStore((s) => s.mode)
  const environmentTab = useAppStore((s) => s.environmentTab)
  const [showMatching, setShowMatching] = useState(false)

  return (
    <div className="app">
      <header className="app__bar">
        <h1 className="app__title">🌍 지구본 사회공부</h1>
        <ModeSwitcher />
      </header>
      <main className="app__main">
        <div className="app__globe">
          <GlobeView />

          {mode === 'climate' && (
            <div className="app__legend">
              <Legend />
            </div>
          )}

          {mode === 'environment' && (
            <>
              <div className="app__bottom">
                <EnvironmentControls />
              </div>
              {environmentTab === 'treaties' && (
                <button
                  type="button"
                  className="matching-launch"
                  onClick={() => setShowMatching(true)}
                >
                  🎯 협약 매칭 게임
                </button>
              )}
            </>
          )}

          {mode === 'culture' && (
            <div className="app__bottom">
              <CultureControls />
            </div>
          )}

          {mode === 'quiz' && (
            <div className="app__quiz-hint">🌍 지도 문제는 지구본을 돌려 나라를 클릭하세요</div>
          )}
        </div>

        {mode === 'climate' && <InfoCard />}
        {mode === 'environment' && <EnvironmentCard />}
        {mode === 'culture' && <CultureCard />}
        {mode === 'quiz' && <QuizMode />}
      </main>

      {showMatching && <MatchingGame onClose={() => setShowMatching(false)} />}
    </div>
  )
}
