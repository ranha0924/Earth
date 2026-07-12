import React from 'react'
import ReactDOM from 'react-dom/client'
// 빈티지 아틀라스 웹폰트 — 제목 Noto Serif KR, 본문 Pretendard (로컬 번들, CDN 미사용).
// 경량화: Noto Serif KR은 앱이 실제 쓰는 글리프만 담은 자체 서브셋(500·700, 가중치당
// ~125KB — scripts/subset-serif.mjs 생성)으로, Pretendard는 가변폰트 동적 서브셋(글자별
// 로딩)으로 로드. fontsource의 korean 서브셋(가중치당 ~1MB) 통짜 로딩을 대체한다.
import './fonts/serif.css'
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import App from './App'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
