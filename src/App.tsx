import { GlobeView } from './globe/GlobeView'
import { ModeSwitcher } from './components/ModeSwitcher'
import { Legend } from './components/Legend'
import { InfoCard } from './components/InfoCard'
import { useAppStore } from './store'

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
        </div>
        <InfoCard />
      </main>
    </div>
  )
}
