import { useAppStore } from '../../store'
import { RELIGIONS } from '../../culture/types'
import { REGIONS } from '../../culture/regions'
import { FESTIVALS } from '../../culture/festivals'
import { Icon } from '../Icon'

/** 문화 모드 하단 컨트롤 — 레이어 토글(종교/문화권/축제) + 해당 범례·목록 */
export function CultureControls() {
  const layer = useAppStore((s) => s.cultureLayer)
  const setLayer = useAppStore((s) => s.setCultureLayer)
  const religionFilter = useAppStore((s) => s.religionFilter)
  const toggleReligion = useAppStore((s) => s.toggleReligionFilter)
  const regionFilter = useAppStore((s) => s.regionFilter)
  const toggleRegion = useAppStore((s) => s.toggleRegionFilter)
  const selectFestival = useAppStore((s) => s.selectFestival)
  const selectedFestival = useAppStore((s) => s.selectedFestival)

  return (
    <div className="culture-controls">
      <div className="env-tabs" role="tablist" aria-label="문화 모드 레이어">
        <button
          type="button"
          role="tab"
          aria-selected={layer === 'religion'}
          className={`env-tab${layer === 'religion' ? ' env-tab--active' : ''}`}
          onClick={() => setLayer('religion')}
        >
          <Icon name="religion" size={14} /> 종교
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={layer === 'region'}
          className={`env-tab${layer === 'region' ? ' env-tab--active' : ''}`}
          onClick={() => setLayer('region')}
        >
          <Icon name="globe" size={14} /> 문화권
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={layer === 'festival'}
          className={`env-tab${layer === 'festival' ? ' env-tab--active' : ''}`}
          onClick={() => setLayer('festival')}
        >
          <Icon name="festival" size={14} /> 축제
        </button>
      </div>

      {layer === 'religion' && (
        <div className="legend" role="group" aria-label="종교 범례">
          {RELIGIONS.map((r) => {
            const active = religionFilter === r.id
            return (
              <button
                key={r.id}
                type="button"
                className={`legend__item${active ? ' legend__item--active' : ''}`}
                aria-pressed={active}
                onClick={() => toggleReligion(r.id)}
              >
                <span className="legend__swatch" style={{ backgroundColor: r.color }} aria-hidden="true" />
                <span className="legend__label">{r.nameKo}</span>
              </button>
            )
          })}
        </div>
      )}

      {layer === 'region' && (
        <div className="legend" role="group" aria-label="세계 문화권 범례">
          {REGIONS.map((r) => {
            const active = regionFilter === r.id
            return (
              <button
                key={r.id}
                type="button"
                className={`legend__item${active ? ' legend__item--active' : ''}`}
                aria-pressed={active}
                onClick={() => toggleRegion(r.id)}
              >
                <span className="legend__swatch" style={{ backgroundColor: r.color }} aria-hidden="true" />
                <span className="legend__label">{r.nameKo.replace(/\s*문화권$/, '')}</span>
              </button>
            )
          })}
        </div>
      )}

      {layer === 'festival' && (
        <div className="env-chip-row">
          {FESTIVALS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`env-chip${selectedFestival === f.id ? ' env-chip--active' : ''}`}
              onClick={() => selectFestival(f.id)}
            >
              <Icon name="festival" size={15} /> {f.nameKo.replace(/\s*\(.*\)/, '')} · {f.countryNameKo}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
