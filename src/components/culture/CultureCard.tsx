import { useAppStore } from '../../store'
import { getCulture, getReligion } from '../../culture/data'
import { RELIGION_LABEL, colorForReligion } from '../../culture/types'
import { FESTIVAL_BY_ID } from '../../culture/festivals'
import { countryNameKo, countryNameEn, hasCountryName } from '../../data/countryNames'

export function CultureCard() {
  const layer = useAppStore((s) => s.cultureLayer)
  const selectedFestival = useAppStore((s) => s.selectedFestival)
  const selectedIso = useAppStore((s) => s.selectedIso)
  const select = useAppStore((s) => s.selectCountry)
  const selectFestival = useAppStore((s) => s.selectFestival)

  // 축제 상세 우선
  if (layer === 'festival' && selectedFestival) {
    const f = FESTIVAL_BY_ID[selectedFestival]
    if (f) {
      return (
        <aside className="card" aria-label={`${f.nameKo} 정보`}>
          <button type="button" className="card__close" onClick={() => selectFestival(null)}>
            닫기 ✕
          </button>
          <h2 className="card__title">🎉 {f.nameKo}</h2>
          <p className="card__title-en">
            {f.countryNameKo} · {f.season}
          </p>
          <div className="card__section">
            <h3 className="card__h3">축제 소개</h3>
            <p className="card__note">{f.description}</p>
          </div>
          <div className="confusion">
            <b>🔑 시험 포인트</b>
            <p>{f.linkPoint}</p>
          </div>
        </aside>
      )
    }
  }

  // 나라 문화 상세
  if (selectedIso && hasCountryName(selectedIso)) {
    const culture = getCulture(selectedIso)
    const religion = getReligion(selectedIso)
    return (
      <aside className="card" aria-label="나라 문화 정보">
        <button type="button" className="card__close" onClick={() => select(null)}>
          닫기 ✕
        </button>
        <h2 className="card__title">
          {countryNameKo(selectedIso)} <span className="card__title-en">{countryNameEn(selectedIso)}</span>
        </h2>
        {religion && (
          <div className="card__row">
            <span className="card__swatch" style={{ backgroundColor: colorForReligion(religion) }} aria-hidden="true" />
            <span className="card__climate">⛪ 주요 종교 · {RELIGION_LABEL[religion]}</span>
          </div>
        )}
        {culture ? (
          <>
            <div className="card__section">
              <h3 className="card__h3">🏠 전통 가옥</h3>
              <p className="card__note">{culture.housing}</p>
            </div>
            <div className="card__section">
              <h3 className="card__h3">👕 전통 의복</h3>
              <p className="card__note">{culture.clothing}</p>
            </div>
            <div className="card__section">
              <h3 className="card__h3">🍚 음식·식문화</h3>
              <p className="card__note">{culture.food}</p>
            </div>
            <div className="card__section">
              <h3 className="card__h3">🙏 종교와 생활</h3>
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
          지구본의 🎉 <b>축제 핀</b>이나 아래 축제 목록을 눌러 세계의 대표 축제를 살펴보세요. 각
          축제가 그 지역의 기후·종교와 어떻게 이어지는지 정리했어요.
        </p>
      )}
    </aside>
  )
}
