import { useAppStore, type Mode } from '../store'

const MODES: { mode: Mode; label: string }[] = [
  { mode: 'climate', label: '기후' },
  { mode: 'environment', label: '환경' },
  { mode: 'culture', label: '문화' },
  { mode: 'quiz', label: '퀴즈' },
]

export function ModeSwitcher() {
  const mode = useAppStore((s) => s.mode)
  const setMode = useAppStore((s) => s.setMode)
  return (
    <nav className="modes" aria-label="모드 전환">
      {MODES.map(({ mode: m, label }) => (
        <button
          key={m}
          type="button"
          className={`modes__btn${mode === m ? ' modes__btn--active' : ''}`}
          aria-pressed={mode === m}
          onClick={() => setMode(m)}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
