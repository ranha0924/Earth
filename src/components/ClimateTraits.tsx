import { type SubtypeInfo, type ClimateId } from '../climate/subtypes'
import { CLIMATE_IMAGES } from '../climate/climateImages'
import { TraitFigure } from './TraitFigure'
import { Icon } from './Icon'

// "왜 이 기후?" — 기후 요인 한 줄
export function ClimateCause({ info }: { info: SubtypeInfo | undefined }) {
  if (!info?.cause) return null
  return <p className="cause"><b>왜 이 기후?</b> {info.cause}</p>
}

// 기후별 식생·인간생활 (통합사회 '자연환경과 인간') + 대표 사진
export function ClimateTraits({ info, cid }: { info: SubtypeInfo | undefined; cid: ClimateId | undefined }) {
  if (!info) return null
  const imgs = cid ? CLIMATE_IMAGES[cid] : undefined
  return (
    <div className="traits">
      <div className="traits__item">
        <span className="traits__label"><Icon name="leaf" size={13} /> 식생</span>
        {imgs && <TraitFigure src={imgs.veg} cap={imgs.vegCap} alt={`${info.ko} 기후의 식생`} />}
        <p className="traits__text">{info.vegetation}</p>
      </div>
      <div className="traits__item">
        <span className="traits__label"><Icon name="people" size={13} /> 인간생활</span>
        {imgs && <TraitFigure src={imgs.life} cap={imgs.lifeCap} alt={`${info.ko} 기후의 인간생활`} />}
        <p className="traits__text">{info.life}</p>
      </div>
    </div>
  )
}
