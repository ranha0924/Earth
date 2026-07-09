import { useAppStore } from '../store'
import { climateData, getCountryClimate } from '../climate/data'
import { colorForGroup } from '../climate/types'
import { getFeaturedClimate } from '../climate/featured'
import { SUBTYPE, SUBTYPE_BY_KO } from '../climate/subtypes'
import { HIGHLAND_BY_ID } from '../climate/highlands'
import { ClimateChart } from './ClimateChart'
import { Icon } from './Icon'

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
