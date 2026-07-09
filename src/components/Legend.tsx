import { SUBTYPE_GROUPS } from '../climate/subtypes'
import { useAppStore } from '../store'

export function Legend() {
  const climateFilter = useAppStore((s) => s.climateFilter)
  const toggle = useAppStore((s) => s.toggleClimateFilter)
  return (
    <div className="legend legend--climate" role="group" aria-label="기후 범례">
      {SUBTYPE_GROUPS.map(({ group, items }) => (
        <div key={group} className="legend__group">
          <span className="legend__group-name">{group}</span>
          {items.map((s) => {
            const active = climateFilter === s.ko
            return (
              <button
                key={s.ko}
                type="button"
                className={`legend__item${active ? ' legend__item--active' : ''}`}
                aria-pressed={active}
                onClick={() => toggle(s.ko)}
              >
                <span
                  className={`legend__swatch${s.hatch ? ' legend__swatch--hatch' : ''}`}
                  style={s.hatch ? undefined : { backgroundColor: s.color }}
                  aria-hidden="true"
                />
                <span className="legend__label">{s.ko}</span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
