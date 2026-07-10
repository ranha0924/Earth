import { useState } from 'react'
import { SUBTYPE, SUBTYPE_GROUPS, ID_BY_KO, type ClimateId } from '../climate/subtypes'
import { CLIMATE_IMAGES } from '../climate/climateImages'
import { getFeaturedClimate } from '../climate/featured'
import { ClimateChart } from './ClimateChart'
import { TraitFigure } from './TraitFigure'
import { Icon } from './Icon'

// 소분류별 대표 기후 그래프용 국가(featured ISO). Dw·EF는 대표 도시 그래프가 없어 생략.
const REP_ISO: Partial<Record<ClimateId, string>> = {
  Af: 'SG', Am: 'IN', Aw: 'TH', BS: 'MN', BW: 'SA',
  Cfa: 'JP', Cfb: 'GB', Cs: 'IT', Cw: 'CN',
  Df: 'RU', ET: 'GL', H: 'BO',
}

interface ClimateCompareProps {
  onClose: () => void
}

function CompareColumn({ cid }: { cid: ClimateId }) {
  const s = SUBTYPE[cid]
  const imgs = CLIMATE_IMAGES[cid]
  const repIso = REP_ISO[cid]
  const city = repIso ? getFeaturedClimate(repIso) : null
  return (
    <div className="compare-col">
      <div className="compare-col__head">
        <span
          className={`card__swatch${s.hatch ? ' legend__swatch--hatch' : ''}`}
          style={s.hatch ? undefined : { backgroundColor: s.color }}
          aria-hidden="true"
        />
        <div>
          <h3 className="compare-col__name">{s.ko}</h3>
          <span className="compare-col__group">{s.group} · {cid}</span>
        </div>
      </div>

      <p className="cause"><b>왜 이 기후?</b> {s.cause}</p>

      {city ? (
        <ClimateChart city={city} />
      ) : (
        <p className="compare-col__nograph">대표 기후 그래프 없음</p>
      )}

      <div className="traits">
        <div className="traits__item">
          <span className="traits__label"><Icon name="leaf" size={13} /> 식생</span>
          <TraitFigure src={imgs.veg} cap={imgs.vegCap} alt={`${s.ko} 기후의 식생`} />
          <p className="traits__text">{s.vegetation}</p>
        </div>
        <div className="traits__item">
          <span className="traits__label"><Icon name="people" size={13} /> 인간생활</span>
          <TraitFigure src={imgs.life} cap={imgs.lifeCap} alt={`${s.ko} 기후의 인간생활`} />
          <p className="traits__text">{s.life}</p>
        </div>
      </div>
    </div>
  )
}

function ClimateSelect({ value, onChange, label }: { value: ClimateId; onChange: (v: ClimateId) => void; label: string }) {
  return (
    <label className="compare-select">
      <span className="compare-select__label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value as ClimateId)}>
        {SUBTYPE_GROUPS.map((g) => (
          <optgroup key={g.group} label={g.group}>
            {g.items.map((item) => {
              const id = ID_BY_KO[item.ko]
              return <option key={id} value={id}>{item.ko}</option>
            })}
          </optgroup>
        ))}
      </select>
    </label>
  )
}

/** 두 기후를 좌우로 나란히 비교 (왜 이 기후·대표 그래프·식생·인간생활) */
export function ClimateCompare({ onClose }: ClimateCompareProps) {
  const [a, setA] = useState<ClimateId>('Cs') // 지중해성
  const [b, setB] = useState<ClimateId>('Cfb') // 서안해양성

  return (
    <div className="compare-overlay" role="dialog" aria-label="기후 비교">
      <div className="compare">
        <div className="compare__head">
          <h2>기후 비교</h2>
          <button type="button" className="card__close" onClick={onClose}>
            닫기 <Icon name="close" size={12} />
          </button>
        </div>
        <div className="compare__selectors">
          <ClimateSelect label="기후 A" value={a} onChange={setA} />
          <span className="compare__vs">vs</span>
          <ClimateSelect label="기후 B" value={b} onChange={setB} />
        </div>
        <div className="compare__cols">
          <CompareColumn cid={a} />
          <CompareColumn cid={b} />
        </div>
      </div>
    </div>
  )
}
