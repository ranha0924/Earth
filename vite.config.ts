/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포 시 base를 저장소 이름으로. 커스텀 도메인/Vercel이면 '/'.
export default defineConfig({
  base: process.env.DEPLOY_BASE ?? '/',
  plugins: [react()],
  build: {
    // globe 벤더 청크(three.js)는 의도적으로 크므로 경고 한도를 올림.
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // 3D 엔진(three/globe.gl)을 앱 코드와 분리해 별도 캐시 청크로.
        manualChunks: {
          globe: ['globe.gl', 'three'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    exclude: ['**/node_modules/**', '**/tests/e2e/**'],
  },
})
