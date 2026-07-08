import { CLIMATE_GROUPS } from '../climate/types'
import { useAppStore } from '../store'

export function Legend() {
  const climateFilter = useAppStore((s) => s.climateFilter)
  const toggle = useAppStore((s) => s.toggleClimateFilter)
  return (
    <div className="legend" role="group" aria-label="기후 범례">
      {CLIMATE_GROUPS.map(({ group, color }) => {
        const active = climateFilter === group
        return (
          <button
            key={group}
            type="button"
            className={`legend__item${active ? ' legend__item--active' : ''}`}
            aria-pressed={active}
            onClick={() => toggle(group)}
          >
            <span className="legend__swatch" style={{ backgroundColor: color }} aria-hidden="true" />
            <span className="legend__label">{group}</span>
          </button>
        )
      })}
    </div>
  )
}
