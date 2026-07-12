import { useId, useMemo, useState } from 'react'
import { useAppStore } from '../store'
import { COUNTRY_LIST } from '../data/countryNames'
import { Icon } from './Icon'

/**
 * 나라를 키보드로 선택하는 검색 상자.
 * 지구본(WebGL 캔버스) 클릭은 키보드·스크린리더로 접근할 수 없으므로,
 * 네이티브 <input list> + <datalist>로 어떤 나라든 타이핑·선택할 수 있게 한다.
 * 선택하면 store의 selectedIso가 바뀌어 지구본 클릭과 동일하게 동작한다(퀴즈 지도 문제 포함).
 */
export function CountryPicker({ compact = false }: { compact?: boolean }) {
  const select = useAppStore((s) => s.selectCountry)
  const inputId = useId()
  const listId = useId()
  const [text, setText] = useState('')

  // 라벨(한국어명 · "한국어 (English)" · 영문명) → iso 역참조
  const byLabel = useMemo(() => {
    const m = new Map<string, string>()
    for (const c of COUNTRY_LIST) {
      m.set(c.ko, c.iso)
      m.set(`${c.ko} (${c.en})`, c.iso)
      if (c.en) m.set(c.en.toLowerCase(), c.iso)
    }
    return m
  }, [])

  const commit = (raw: string): boolean => {
    const v = raw.trim()
    const iso = byLabel.get(v) ?? byLabel.get(v.toLowerCase())
    if (iso) {
      select(iso)
      setText('')
      return true
    }
    return false
  }

  return (
    <form
      className={`country-picker${compact ? ' country-picker--compact' : ''}`}
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        commit(text)
      }}
    >
      <label htmlFor={inputId} className="country-picker__label">
        <Icon name="globe" size={13} /> 나라 검색
      </label>
      <div className="country-picker__row">
        <input
          id={inputId}
          list={listId}
          className="country-picker__input"
          type="text"
          inputMode="search"
          autoComplete="off"
          placeholder="예: 대한민국, France"
          value={text}
          onChange={(e) => {
            const v = e.target.value
            // 목록에서 정확히 고르면(또는 완전한 이름을 입력하면) 바로 선택
            if (!commit(v)) setText(v)
          }}
        />
        <button type="submit" className="country-picker__go">
          이동
        </button>
      </div>
      <datalist id={listId}>
        {COUNTRY_LIST.map((c) => (
          <option key={c.iso} value={c.ko}>
            {c.en}
          </option>
        ))}
      </datalist>
    </form>
  )
}
