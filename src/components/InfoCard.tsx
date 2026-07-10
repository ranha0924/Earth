import type { SyntheticEvent } from 'react'
import { useAppStore } from '../store'
import { climateData, getCountryClimate } from '../climate/data'
import { colorForGroup } from '../climate/types'
import { getFeaturedClimate } from '../climate/featured'
import { SUBTYPE, SUBTYPE_BY_KO, ID_BY_KO, type SubtypeInfo, type ClimateId } from '../climate/subtypes'
import { CLIMATE_IMAGES } from '../climate/climateImages'
import { HIGHLAND_BY_ID } from '../climate/highlands'
import { ClimateChart } from './ClimateChart'
import { Icon } from './Icon'

// CDN 이미지 로드 실패 시 캡션까지 통째로 숨김
function hideBroken(e: SyntheticEvent<HTMLImageElement>) {
  const fig = e.currentTarget.closest('figure')
  if (fig instanceof HTMLElement) fig.style.display = 'none'
  else e.currentTarget.style.display = 'none'
}

// 대표 사진 + 대표 지역 캡션 + AI 생성 표시(오개념 방지)
function TraitFigure({ src, cap, alt }: { src: string; cap: string; alt: string }) {
  return (
    <figure className="traits__fig">
      <img className="traits__img" src={src} alt={alt} loading="lazy" decoding="async" onError={hideBroken} />
      <figcaption className="traits__cap">
        <span>{cap}</span>
        <span className="traits__ai" title="실제 사진이 아니라 이해를 돕기 위해 AI로 생성한 이미지예요">AI 생성</span>
      </figcaption>
    </figure>
  )
}

// 기후별 식생·인간생활 (통합사회 '자연환경과 인간') + 대표 사진
function ClimateTraits({ info, cid }: { info: SubtypeInfo | undefined; cid: ClimateId | undefined }) {
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

export function InfoCard() {
  const selectedIso = useAppStore((s) => s.selectedIso)
  const select = useAppStore((s) => s.selectCountry)
  if (!selectedIso) return null

  // 고산 지역 오버레이 선택
  if (selectedIso.startsWith('highland:')) {
    const h = HIGHLAND_BY_ID[selectedIso.slice('highland:'.length)]
    if (!h) return null
    return (
      <aside className="card" aria-label="고산 지역 정보">
        <button type="button" className="card__close" onClick={() => select(null)}>
          닫기 <Icon name="close" size={12} />
        </button>
        <h2 className="card__title">{h.nameKo}<span className="card__title-en">고산 기후 지역</span></h2>
        <div className="card__row">
          <span className="card__swatch" style={{ backgroundColor: colorForGroup('고산') }} aria-hidden="true" />
          <span className="card__climate">고산 기후 (H) · {h.cities}</span>
        </div>
        <p className="card__note">{h.note}</p>
        <ClimateTraits info={SUBTYPE.H} cid="H" />
        <div className="confusion">
          <b><Icon name="warning" size={13} /> 개념 포인트</b>
          <p>고산 기후는 나라 전체가 아니라 <b>해발 고도가 높은 지역</b>에만 나타나요. 저위도(적도 부근)라도 고도가 높으면 연중 서늘합니다.</p>
        </div>
      </aside>
    )
  }

  const climate = getCountryClimate(climateData, selectedIso)
  const featured = getFeaturedClimate(selectedIso)

  return (
    <aside className="card" aria-label="나라 정보">
      <button type="button" className="card__close" onClick={() => select(null)}>
        닫기 <Icon name="close" size={12} />
      </button>
      {climate ? (
        <>
          <h2 className="card__title">
            {climate.nameKo} <span className="card__title-en">{climate.nameEn}</span>
          </h2>
          <div className="card__row">
            <span
              className={`card__swatch${SUBTYPE_BY_KO[climate.subtype]?.hatch ? ' legend__swatch--hatch' : ''}`}
              style={SUBTYPE_BY_KO[climate.subtype]?.hatch ? undefined : { backgroundColor: SUBTYPE_BY_KO[climate.subtype]?.color ?? colorForGroup(climate.group) }}
              aria-hidden="true"
            />
            <span className="card__climate">대표 기후 · {climate.group} · {climate.subtype}</span>
          </div>

          {featured && featured.climates.length > 1 && (
            <div className="climate-list">
              <span className="climate-list__label">이 나라의 기후</span>
              <div className="climate-list__chips">
                {featured.climates.map((cid) => (
                  <span key={cid} className="climate-chip">
                    <span
                      className={`climate-chip__dot${SUBTYPE[cid].hatch ? ' legend__swatch--hatch' : ''}`}
                      style={SUBTYPE[cid].hatch ? undefined : { backgroundColor: SUBTYPE[cid].color }}
                    />
                    {SUBTYPE[cid].ko}
                  </span>
                ))}
              </div>
              <p className="climate-list__note">※ 지도는 위도·지형에 따른 실제 기후 분포를 보여줘요. 아래 스와치가 대표 기후예요.</p>
            </div>
          )}

          <ClimateTraits info={SUBTYPE_BY_KO[climate.subtype]} cid={ID_BY_KO[climate.subtype]} />

          {featured && <ClimateChart city={featured} />}

          {(featured?.note || climate.note) && (
            <p className="card__note">{featured?.note ?? climate.note}</p>
          )}
        </>
      ) : (
        <p className="card__empty">이 나라의 기후 정보는 준비 중이에요. 지구본 색으로 기후대를 확인해 보세요.</p>
      )}
    </aside>
  )
}
