import { GlobeView } from './globe/GlobeView'
import { ModeSwitcher } from './components/ModeSwitcher'
import { Legend } from './components/Legend'
import { InfoCard } from './components/InfoCard'
import { useAppStore, type Mode } from './store'

const MODE_NAMES: Record<Mode, string> = {
  climate: '기후',
  environment: '환경',
  culture: '문화',
  quiz: '퀴즈',
}

export default function App() {
  const mode = useAppStore((s) => s.mode)
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
          {mode !== 'climate' && (
            <div className="app__soon">
              🚧 {MODE_NAMES[mode]} 모드는 준비 중이에요. 지금은 기후 모드를 이용해 주세요.
            </div>
          )}
        </div>
        {mode === 'climate' && <InfoCard />}
      </main>
    </div>
  )
}
