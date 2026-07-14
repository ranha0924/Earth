// 빈티지 아틀라스용 1px 라인 아이콘 — 이모지 대체. stroke: currentColor.
// name 하나로 SVG 조각을 반환. 환경문제는 issue.id를 name으로 그대로 사용.
import type { ReactNode } from 'react'

const PATHS: Record<string, ReactNode> = {
  // ── UI ──
  close: <path d="M6 6l12 12M18 6L6 18" />,
  target: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <circle cx="12" cy="12" r="2.2" />
    </>
  ),
  check: <path d="M4 12.5l5 5L20 6.5" />,
  cross: <path d="M6 6l12 12M18 6L6 18" />,
  location: (
    <>
      <path d="M12 22c5-6 7-9.5 7-13a7 7 0 10-14 0c0 3.5 2 7 7 13z" />
      <circle cx="12" cy="9" r="2.4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" />
    </>
  ),
  flag: (
    <>
      <path d="M6 3v18" />
      <path d="M6 4h11l-2 3 2 3H6" />
    </>
  ),
  note: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="1" />
      <path d="M9 3.5h6v3H9zM8.5 11h7M8.5 15h5" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="M11 11l8 8M16 16l2-2M18 18l2-2" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3L2.5 20h19L12 3z" />
      <path d="M12 10v5M12 17.5v.5" />
    </>
  ),
  treaty: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </>
  ),

  // ── 기후 특징 ──
  leaf: (
    <>
      <path d="M5 19c0-8 5-13 14-14 1 9-4 15-12 15z" />
      <path d="M9 15c2-3 4-4.5 7-5.5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20c0-3.5 2.5-6 5.5-6s5.5 2.5 5.5 6" />
      <path d="M16 6.5a2.6 2.6 0 010 5M17 14.5c2.4.4 4 2.6 4 5.5" />
    </>
  ),

  // ── 문화 ──
  religion: (
    <>
      <path d="M4 21h16M6 21V11l6-4 6 4v10" />
      <path d="M10 21v-4h4v4" />
    </>
  ),
  festival: (
    <>
      <path d="M6 21V4" />
      <path d="M6 5c3-2 6 2 9 0v7c-3 2-6-2-9 0" />
    </>
  ),
  housing: (
    <>
      <path d="M4 11l8-6 8 6" />
      <path d="M6 10v10h12V10" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  clothing: (
    <path d="M8 3l4 2 4-2 4 4-3 2v10H7V9L4 7z" />
  ),
  food: (
    <>
      <path d="M3 11h18a9 9 0 01-18 0z" />
      <path d="M12 3c-1 1.5-1 2.5 0 4M9 4.5c-.6 1-.6 1.8 0 2.8M15 4.5c-.6 1-.6 1.8 0 2.8" />
    </>
  ),
  // 상징적 건축물 — 기둥·박공을 갖춘 신전/기념물
  landmark: (
    <>
      <path d="M12 3l9 5H3l9-5z" />
      <path d="M5 8v9M9.5 8v9M14.5 8v9M19 8v9" />
      <path d="M4 17.5h16M3 21h18" />
    </>
  ),

  // ── 환경문제 (issue.id) ──
  'acid-rain': (
    <>
      <path d="M7 11a4 4 0 010-8 5 5 0 019.5 1.5A3.5 3.5 0 0116 11z" />
      <path d="M8 15l-1 3M12 15l-1 3M16 15l-1 3" />
    </>
  ),
  ozone: (
    <>
      <path d="M12 3a9 9 0 108 5" />
      <path d="M9 12h6M12 9v6" />
    </>
  ),
  deforestation: (
    <>
      <path d="M12 15V9m0 0l-3 3m3-3l3 3M12 9c0-3 2-4 2-4M12 21v-6" />
      <path d="M15 19l5-4" />
    </>
  ),
  desertification: (
    <>
      <circle cx="8" cy="8" r="3" />
      <path d="M3 17c2.5-2 4.5 2 7 0s4.5-2 7 0M3 20.5c2.5-2 4.5 2 7 0s4.5-2 7 0" />
    </>
  ),
  'fine-dust': (
    <>
      <path d="M3 9h11M17 9h4M3 13h6M12 13h9M3 17h13" />
      <circle cx="18" cy="6" r="1" />
    </>
  ),
  marine: (
    <>
      <path d="M3 10c2.5-2.5 4.5 2.5 7 0s4.5-2.5 7 0 4.5 2.5 4 2.5" />
      <path d="M3 15c2.5-2.5 4.5 2.5 7 0s4.5-2.5 7 0 4.5 2.5 4 2.5" />
    </>
  ),
  microplastic: (
    <>
      <rect x="4" y="5" width="4" height="4" rx="1" />
      <rect x="14" y="7" width="4" height="4" rx="1" />
      <rect x="8" y="13" width="4" height="4" rx="1" />
      <rect x="16" y="15" width="3.5" height="3.5" rx="1" />
    </>
  ),
}

export interface IconProps {
  name: string
  size?: number
  className?: string
}

export function Icon({ name, size = 16, className }: IconProps) {
  const path = PATHS[name] ?? null
  return (
    <svg
      className={`icon${className ? ' ' + className : ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  )
}
