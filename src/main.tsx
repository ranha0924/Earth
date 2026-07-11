import React from 'react'
import ReactDOM from 'react-dom/client'
// 빈티지 아틀라스 웹폰트 — 제목 Noto Serif KR, 본문 Pretendard (로컬 번들, CDN 미사용).
// 경량화: Noto Serif KR은 실제 쓰는 한국어+라틴 서브셋(500·700)만, Pretendard는
// 정적 7-weight(woff, ~8MB) 대신 가변폰트 동적 서브셋(woff2, 글자별 로딩)으로 로드.
import '@fontsource/noto-serif-kr/korean-500.css'
import '@fontsource/noto-serif-kr/korean-700.css'
import '@fontsource/noto-serif-kr/latin-500.css'
import '@fontsource/noto-serif-kr/latin-700.css'
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import App from './App'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
