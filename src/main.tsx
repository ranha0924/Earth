import React from 'react'
import ReactDOM from 'react-dom/client'
// 빈티지 아틀라스 웹폰트 — 제목 Noto Serif KR, 본문 Pretendard (로컬 번들, CDN 미사용)
import '@fontsource/noto-serif-kr/500.css'
import '@fontsource/noto-serif-kr/700.css'
import 'pretendard/dist/web/static/pretendard.css'
import App from './App'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
