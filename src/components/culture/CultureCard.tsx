import { useAppStore } from '../../store'
import { getCulture, getReligion } from '../../culture/data'
import { RELIGION_LABEL, colorForReligion } from '../../culture/types'
import { FESTIVAL_BY_ID } from '../../culture/festivals'
import { FESTIVAL_IMAGES } from '../../culture/festivalImages'
import { getRegion, REGION_BY_ID } from '../../culture/regions'
import { countryNameKo, countryNameEn, hasCountryName } from '../../data/countryNames'
import { Icon } from '../Icon'
import { TraitFigure } from '../TraitFigure'

export function CultureCard() {
  const layer = useAppStore((s) => s.cultureLayer)
  const selectedFestival = useAppStore((s) => s.selectedFestival)
  const selectedIso = useAppStore((s) => s.selectedIso)
  const select = useAppStore((s) => s.selectCountry)
  const selectFestival = useAppStore((s) => s.selectFestival)
  const regionFilter = useAppStore((s) => s.regionFilter)
  const toggleRegion = useAppStore((s) => s.toggleRegionFilter)

  // 축제 상세 우선
  if (layer === 'festival' && selectedFestival) {
    const f = FESTIVAL_BY_ID[selectedFestival]
    if (f) {
      const fi = FESTIVAL_IMAGES[f.id]
      return (
        <aside className="card" aria-label={`${f.nameKo} 정보`}>
          <button type="button" className="card__close" onClick={() => selectFestival(null)}>
            닫기 <Icon name="close" size={12} />
          </button>
          <h2 className="card__title"><Icon name="festival" size={19} /> {f.nameKo}</h2>
          <p className="card__title-en">
            {f.countryNameKo} · {f.season}
          </p>
          {fi && <TraitFigure src={fi.src} cap={fi.cap} alt={`${f.nameKo} 대표 사진`} />}
          <div className="card__section">
            <h3 className="card__h3">축제 소개</h3>
            <p className="card__note">{f.description}</p>
          </div>
          <div className="confusion">
            <b><Icon name="key" size={13} /> 시험 포인트</b>
            <p>{f.linkPoint}</p>
          </div>
        </aside>
      )
    }
  }

  // 문화권 상세 (선택 나라의 문화권 우선, 없으면 범례로 고른 문화권)
  if (layer === 'region') {
    const rid = getRegion(selectedIso) ?? regionFilter
    if (rid) {
      const rg = REGION_BY_ID[rid]
      const countryKo = selectedIso && hasCountryName(selectedIso) ? countryNameKo(selectedIso) : null
      return (
        <aside className="card" aria-label={`${rg.nameKo} 정보`}>
          <button
            type="button"
            className="card__close"
            onClick={() => {
              select(null)
              if (regionFilter) toggleRegion(regionFilter)
            }}
          >
            닫기 <Icon name="close" size={12} />
          </button>
          <h2 className="card__title"><Icon name="globe" size={19} /> {rg.nameKo}</h2>
          <p className="card__title-en">{countryKo ? `${countryKo} · ${rg.area}` : rg.area}</p>
          <div className="card__row">
            <span className="card__swatch" style={{ backgroundColor: rg.color }} aria-hidden="true" />
            <span className="card__climate">세계 9개 문화권 중 하나</span>
          </div>
          <div className="card__section">
            <h3 className="card__h3"><Icon name="religion" size={13} /> 주요 종교·사상</h3>
            <p className="card__note">{rg.religion}</p>
          </div>
          <div className="card__section">
            <h3 className="card__h3"><Icon name="note" size={13} /> 주요 언어</h3>
            <p className="card__note">{rg.language}</p>
          </div>
          <div className="card__section">
            <h3 className="card__h3"><Icon name="people" size={13} /> 문화 특징</h3>
            <p className="card__note">{rg.traits}</p>
          </div>
          <div className="confusion">
            <b><Icon name="key" size={13} /> 시험 포인트</b>
            <p>{rg.linkPoint}</p>
          </div>
        </aside>
      )
    }
    return (
      <aside className="card" aria-label="문화권 정보">
        <p className="card__empty">
          지구본 색은 세계 <b>9개 문화권</b>이에요. 나라를 누르거나 아래 범례를 누르면 그 문화권의
          종교·언어·생활 특징과 기후 연계를 볼 수 있어요.
        </p>
      </aside>
    )
  }

  // 나라 문화 상세
  if (selectedIso && hasCountryName(selectedIso)) {
    const culture = getCulture(selectedIso)
    const religion = getReligion(selectedIso)
    return (
      <aside className="card" aria-label="나라 문화 정보">
        <button type="button" className="card__close" onClick={() => select(null)}>
          닫기 <Icon name="close" size={12} />
        </button>
        <h2 className="card__title">
          {countryNameKo(selectedIso)} <span className="card__title-en">{countryNameEn(selectedIso)}</span>
        </h2>
        {religion && (
          <div className="card__row">
            <span className="card__swatch" style={{ backgroundColor: colorForReligion(religion) }} aria-hidden="true" />
            <span className="card__climate">주요 종교 · {RELIGION_LABEL[religion]}</span>
          </div>
        )}
        {culture ? (
          <>
            <div className="card__section">
              <h3 className="card__h3"><Icon name="housing" size={13} /> 전통 가옥</h3>
              <p className="card__note">{culture.housing}</p>
            </div>
            <div className="card__section">
              <h3 className="card__h3"><Icon name="clothing" size={13} /> 전통 의복</h3>
              <p className="card__note">{culture.clothing}</p>
            </div>
            <div className="card__section">
              <h3 className="card__h3"><Icon name="food" size={13} /> 음식·식문화</h3>
              <p className="card__note">{culture.food}</p>
            </div>
            <div className="card__section">
              <h3 className="card__h3"><Icon name="religion" size={13} /> 종교와 생활</h3>
              <p className="card__note">{culture.religionNote}</p>
            </div>
          </>
        ) : (
          <p className="card__empty">
            이 나라의 전통 문화 상세는 준비 중이에요. 지구본 색으로 주요 종교를 확인하고, 종교
            범례를 눌러 같은 종교 문화권을 살펴보세요.
          </p>
        )}
      </aside>
    )
  }

  // 안내
  return (
    <aside className="card" aria-label="문화 정보">
      {layer === 'religion' ? (
        <p className="card__empty">
          지구본 색은 나라의 <b>주요 종교</b>예요. 나라를 누르면 종교·전통 가옥·의복·음식을 볼 수
          있고, 아래 범례를 누르면 같은 종교 문화권이 지구본에 강조됩니다.
        </p>
      ) : (
        <p className="card__empty">
          지구본의 <b>축제 핀</b>이나 아래 축제 목록을 눌러 세계의 대표 축제를 살펴보세요. 각
          축제가 그 지역의 기후·종교와 어떻게 이어지는지 정리했어요.
        </p>
      )}
    </aside>
  )
}
