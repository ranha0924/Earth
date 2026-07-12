import { useEffect, useRef } from 'react'

/**
 * 선택(key)이 바뀌면 그 카드를 우측 패널 안에서 보이도록 부드럽게 스크롤한다.
 * - 나라·기후·축제 등을 누르면 오른쪽 패널이 직접 스크롤하지 않아도 해당 카드가 보인다.
 * - key가 falsy(선택 해제)면 스크롤하지 않는다.
 * - 이미 화면에 보이는 카드는 브라우저가 스크롤하지 않는다(block: 'nearest').
 */
export function useScrollIntoView<T extends HTMLElement = HTMLElement>(key: unknown) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (key == null || key === '') return
    const el = ref.current
    if (!el || typeof el.scrollIntoView !== 'function') return
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [key])
  return ref
}
