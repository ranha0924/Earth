import { useAppStore } from '../../store'
import { getCulture, getReligion } from '../../culture/data'
import { RELIGION_LABEL, colorForReligion, RELIGION_BY_ID } from '../../culture/types'
import { FESTIVAL_BY_ID } from '../../culture/festivals'
import { FESTIVAL_IMAGES } from '../../culture/festivalImages'
import { getRegion, REGION_BY_ID } from '../../culture/regions'
import { REGION_IMAGES } from '../../culture/regionImages'
import { RELIGION_IMAGES } from '../../culture/religionImages'
import { countryNameKo, countryNameEn, hasCountryName } from '../../data/countryNames'
import { Icon } from '../Icon'
import { TraitFigure } from '../TraitFigure'
import { useScrollIntoView } from '../../hooks/useScrollIntoView'

export function CultureCard() {
  const layer = useAppStore((s) => s.cultureLayer)
  const selectedFestival = useAppStore((s) => s.selectedFestival)
  const selectedIso = useAppStore((s) => s.selectedIso)
  const select = useAppStore((s) => s.selectCountry)
  const selectFestival = useAppStore((s) => s.selectFestival)
  const regionFilter = useAppStore((s) => s.regionFilter)
  const toggleRegion = useAppStore((s) => s.toggleRegionFilter)
  const religionFilter = useAppStore((s) => s.religionFilter)
  const toggleReligion = useAppStore((s) => s.toggleReligionFilter)
  // 나라·축제·문화권·종교 중 무엇을 눌러도 그 상세 카드가 패널 안에서 보이도록 스크롤
  const cardRef = useScrollIntoView<HTMLElement>(
    selectedFestival ?? selectedIso ?? regionFilter ?? religionFilter,
  )

  // 축제 상세 우선
  if (layer === 'festival' && selectedFestival) {
    const f = FESTIVAL_BY_ID[selectedFestival]
    if (f) {
      const fi = FESTIVAL_IMAGES[f.id]
      return (
        <aside ref={cardRef} className="card" aria-label={`${f.nameKo} 정보`}>
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
      const ri = REGION_IMAGES[rid]
      const countryKo = selectedIso && hasCountryName(selectedIso) ? countryNameKo(selectedIso) : null
      return (
        <aside ref={cardRef} className="card" aria-label={`${rg.nameKo} 정보`}>
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
          {ri && <TraitFigure src={ri.src} cap={ri.cap} alt={`${rg.nameKo} 대표 사진`} />}
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
      <aside ref={cardRef} className="card" aria-label="나라 문화 정보">
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

  // 종교 상세 (범례로 고른 종교) — 상징 건축물·생활양식·대표 사진
  if (layer === 'religion' && religionFilter) {
    const r = RELIGION_BY_ID[religionFilter]
    const ri = RELIGION_IMAGES[religionFilter]
    return (
      <aside ref={cardRef} className="card" aria-label={`${r.nameKo} 정보`}>
        <button type="button" className="card__close" onClick={() => toggleReligion(religionFilter)}>
          닫기 <Icon name="close" size={12} />
        </button>
        <h2 className="card__title"><Icon name="religion" size={19} /> {r.nameKo}</h2>
        {ri && <TraitFigure src={ri.src} cap={ri.cap} alt={`${r.nameKo} 상징 건축물 대표 사진`} />}
        <div className="card__row">
          <span className="card__swatch" style={{ backgroundColor: r.color }} aria-hidden="true" />
          <span className="card__climate">세계 주요 종교 분류</span>
        </div>
        <p className="card__note">{r.overview}</p>
        <div className="card__section">
          <h3 className="card__h3"><Icon name="landmark" size={13} /> 상징적 건축물</h3>
          <p className="card__note">{r.architecture}</p>
        </div>
        <div className="card__section">
          <h3 className="card__h3"><Icon name="people" size={13} /> 생활양식</h3>
          <p className="card__note">{r.lifestyle}</p>
        </div>
        <div className="card__section">
          <h3 className="card__h3"><Icon name="globe" size={13} /> 주요 분포</h3>
          <p className="card__note">{r.distribution}</p>
        </div>
        <div className="confusion">
          <b><Icon name="key" size={13} /> 시험 포인트</b>
          <p>{r.linkPoint}</p>
        </div>
      </aside>
    )
  }

  // 안내
  return (
    <aside className="card" aria-label="문화 정보">
      {layer === 'religion' ? (
        <p className="card__empty">
          지구본 색은 나라의 <b>주요 종교</b>예요. 나라를 누르면 그 나라의 전통 가옥·의복·음식을,
          아래 <b>종교 범례</b>를 누르면 그 종교의 상징 건축물·생활양식·대표 사진을 볼 수 있어요.
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
