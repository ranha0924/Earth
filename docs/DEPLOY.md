# 배포 (Vercel)

이 앱은 서버 없는 정적 Vite 앱이라 Vercel에 그대로 배포된다. 두 가지 방법:

## 방법 A — Git 연동 (권장, 자동 배포)
1. https://vercel.com 에 GitHub 계정으로 로그인
2. "Add New… → Project" → 이 저장소(Earth) import
3. Framework Preset: **Vite** (자동 감지됨), Build Command `npm run build`, Output `dist` (vercel.json에 이미 지정됨)
4. Deploy 클릭. 이후 main에 push하면 자동 재배포된다.

## 방법 B — CLI (즉시 배포)
로컬에서:
```
npx vercel          # 최초 1회 로그인 + 프로젝트 연결(대화형)
npx vercel --prod   # 프로덕션 배포
```
CLI 로그인은 대화형이므로 터미널에서 직접 실행해야 한다.

## 주의
- base 경로는 루트(`/`)다. 별도 환경변수 불필요.
- 텍스처/GeoJSON은 `public/`에 있어 빌드 시 `dist/` 루트로 복사되고 `/textures`, `/data`에서 서빙된다.
