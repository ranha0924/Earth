import type { SyntheticEvent } from 'react'

// CDN 이미지 로드 실패 시 캡션까지 통째로 숨김
function hideBroken(e: SyntheticEvent<HTMLImageElement>) {
  const fig = e.currentTarget.closest('figure')
  if (fig instanceof HTMLElement) fig.style.display = 'none'
  else e.currentTarget.style.display = 'none'
}

// 대표 사진 + 대표 지역 캡션 + AI 생성 표시(오개념 방지).
// 국가 카드(InfoCard)와 기후 비교(ClimateCompare)에서 공유.
export function TraitFigure({ src, cap, alt }: { src: string; cap: string; alt: string }) {
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
