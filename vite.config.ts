/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포 시 base를 저장소 이름으로. 커스텀 도메인/Vercel이면 '/'.
export default defineConfig({
  base: process.env.DEPLOY_BASE ?? '/',
  plugins: [react()],
  build: {
    // GlobeView를 React.lazy로 지연 로드 → Rollup이 three/globe.gl을 GlobeView
    // async 청크로 자동 분할한다. manualChunks로 강제하면 엔트리와 정적으로 묶여
    // index.html에 modulepreload가 걸리므로(지연 로드 무력화) 쓰지 않는다.
    // 그 async 청크(three ~1.9MB)는 의도적으로 크므로 경고 한도만 올린다.
    chunkSizeWarningLimit: 2000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    exclude: ['**/node_modules/**', '**/tests/e2e/**'],
  },
})
