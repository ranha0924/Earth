import { useAppStore } from '../store'
import { SUBTYPE_BY_KO, ID_BY_KO } from '../climate/subtypes'
import { ClimateCause, ClimateTraits } from './ClimateTraits'
import { Icon } from './Icon'

// 범례에서 기후(소분류)를 눌렀을 때: 왜 이 기후 + 식생·인간생활(사진)
export function ClimateSubtypeCard() {
  const climateFilter = useAppStore((s) => s.climateFilter)
  const setFilter = useAppStore((s) => s.setClimateFilter)
  if (!climateFilter) return null
  const info = SUBTYPE_BY_KO[climateFilter]
  if (!info) return null
  const cid = ID_BY_KO[climateFilter]
  return (
    <aside className="card" aria-label={`${info.ko} 기후 정보`}>
      <button type="button" className="card__close" onClick={() => setFilter(null)}>
        닫기 <Icon name="close" size={12} />
      </button>
      <h2 className="card__title">
        {info.ko}<span className="card__title-en">{info.group} 기후</span>
      </h2>
      <div className="card__row">
        <span
          className={`card__swatch${info.hatch ? ' legend__swatch--hatch' : ''}`}
          style={info.hatch ? undefined : { backgroundColor: info.color }}
          aria-hidden="true"
        />
        <span className="card__climate">{info.group} · {info.ko}</span>
      </div>
      <ClimateCause info={info} />
      <ClimateTraits info={info} cid={cid} />
    </aside>
  )
}
