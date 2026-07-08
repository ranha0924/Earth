import { useState } from 'react'
import { GlobeView } from './globe/GlobeView'
import { ModeSwitcher } from './components/ModeSwitcher'
import { Legend } from './components/Legend'
import { InfoCard } from './components/InfoCard'
import { EnvironmentControls } from './components/environment/EnvironmentControls'
import { EnvironmentCard } from './components/environment/EnvironmentCard'
import { MatchingGame } from './components/environment/MatchingGame'
import { useAppStore, type Mode } from './store'

const MODE_NAMES: Record<Mode, string> = {
  climate: '기후',
  environment: '환경',
  culture: '문화',
  quiz: '퀴즈',
}

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

          {(mode === 'culture' || mode === 'quiz') && (
            <div className="app__soon">
              🚧 {MODE_NAMES[mode]} 모드는 준비 중이에요. 지금은 기후·환경 모드를 이용해 주세요.
            </div>
          )}
        </div>

        {mode === 'climate' && <InfoCard />}
        {mode === 'environment' && <EnvironmentCard />}
      </main>

      {showMatching && <MatchingGame onClose={() => setShowMatching(false)} />}
    </div>
  )
}
