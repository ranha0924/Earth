import { useAppStore } from '../store'
import { climateData, getCountryClimate } from '../climate/data'
import { colorForGroup } from '../climate/types'
import { Icon } from './Icon'

export function InfoCard() {
  const selectedIso = useAppStore((s) => s.selectedIso)
  const select = useAppStore((s) => s.selectCountry)
  if (!selectedIso) return null

  const climate = getCountryClimate(climateData, selectedIso)

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
            <span className="card__swatch" style={{ backgroundColor: colorForGroup(climate.group) }} aria-hidden="true" />
            <span className="card__climate">{climate.group} · {climate.subtype}</span>
          </div>
          {climate.note && <p className="card__note">{climate.note}</p>}
        </>
      ) : (
        <p className="card__empty">이 나라의 기후 정보는 준비 중이에요. 지구본 색으로 기후대를 확인해 보세요.</p>
      )}
    </aside>
  )
}
