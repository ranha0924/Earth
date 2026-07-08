# 3D 지구본 학습 사이트 — 1단계(MVP: 기후 모드) 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 3D 지구본에 실제 쾨펜 기후대 텍스처를 입히고, 나라를 클릭하면 그 나라 기후 카드가 뜨며, 범례로 특정 기후대만 강조할 수 있는 배포 가능한 반응형 웹 학습 도구(MVP)를 만든다.

**Architecture:** 서버 없는 정적 React SPA. 상태(현재 모드/선택 나라/기후 필터)는 Zustand 스토어 하나로 관리한다. 3D 지구본은 globe.gl(Three.js 래퍼)을 imperative하게 감싼 단일 컴포넌트가 담당하고, 나머지(범례·카드·모드 전환·앱 셸)는 순수 React 컴포넌트다. 학습 데이터는 정적 JSON + 텍스처 이미지 + 국경 GeoJSON. WebGL을 못 돌리는 순수 함수·컴포넌트는 단위/컴포넌트 테스트로, 지구본 렌더·클릭은 Playwright E2E로 검증한다.

**Tech Stack:** Vite, React 18, TypeScript, globe.gl, three, zustand, Vitest, @testing-library/react, @playwright/test.

## Global Constraints

- 언어/빌드: React 18 + TypeScript(strict) + Vite. 패키지 매니저는 `npm`.
- 3D 라이브러리: `globe.gl` (내부적으로 `three` 사용). 직접 Three.js 씬을 새로 짜지 않는다.
- 상태관리: `zustand` 스토어 하나. 전역 상태는 `mode`, `selectedIso`, `climateFilter`만 둔다.
- 백엔드 없음: 모든 데이터는 정적 파일. 런타임 네트워크 호출은 정적 애셋(fetch로 GeoJSON/JSON) 로딩뿐.
- 반응형: PC(≥768px)는 좌 지구본 / 우 카드, 모바일(<768px)은 지구본 전체화면 + 하단 슬라이드업 카드.
- UI 문구는 한국어.
- 기후 대분류 6개와 색은 고정: 열대 `#1b7837`, 건조 `#f2c744`, 온대 `#91cf60`, 냉대 `#4575b4`, 한대 `#d9d9d9`, 고산 `#8c6bb1`.
- 색맹 배려: 범례·카드에서 색에는 항상 텍스트 라벨을 병기한다.
- 나라 식별 키: ISO 3166-1 alpha-2 대문자(예: `KR`). GeoJSON feature와 climate 데이터를 이 키로 연결한다.
- 국경 데이터: Natural Earth(퍼블릭 도메인) 기반 GeoJSON.

---

## File Structure

```
package.json                     의존성·스크립트
vite.config.ts                   Vite + 테스트(vitest) 설정, GitHub Pages base
tsconfig.json                    TypeScript strict 설정
index.html                       앱 진입 HTML
playwright.config.ts             E2E 설정
.github/workflows/deploy.yml     GitHub Pages 배포

public/textures/koppen.png       재채색 쾨펜 기후 지도(등장방형)
public/data/countries.geojson    Natural Earth 국경

src/main.tsx                     React 진입점
src/App.tsx                       앱 셸(레이아웃 + 컴포넌트 조립)
src/App.css                       반응형 레이아웃 스타일

src/store.ts                      Zustand 스토어(mode/selectedIso/climateFilter)
src/climate/types.ts             기후 타입 + 그룹/색 상수
src/climate/data.ts              climate.json 로딩 + getCountryClimate()
src/climate/climate.json         나라→기후 시드 데이터
src/globe/featureIso.ts          GeoJSON feature → ISO alpha-2 추출(순수 함수)
src/globe/GlobeView.tsx          globe.gl 래퍼 컴포넌트
src/components/ModeSwitcher.tsx   기후/환경/문화/퀴즈 전환 버튼
src/components/Legend.tsx         기후 범례 + 클릭 필터
src/components/InfoCard.tsx       선택 나라 기후 카드

tests/e2e/mvp.spec.ts             Playwright E2E
```

각 파일은 책임 하나만 진다. 순수 로직(`featureIso.ts`, `climate/data.ts`, `store.ts`)과 표현(컴포넌트)을 분리해, globe.gl이 없어도 로직을 테스트할 수 있게 한다.

---

### Task 1: 프로젝트 스캐폴딩과 테스트 하네스

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`
- Create: `src/smoke.test.ts`

**Interfaces:**
- Consumes: 없음(최초 태스크)
- Produces: 동작하는 Vite+React+TS 앱, `npm run dev`/`npm run build`/`npm test` 스크립트, jsdom 환경의 Vitest.

- [ ] **Step 1: 의존성 정의 (`package.json`)**

```json
{
  "name": "earth-globe-study",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  },
  "dependencies": {
    "globe.gl": "^2.32.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "three": "^0.161.0",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.0",
    "@testing-library/jest-dom": "^6.4.5",
    "@testing-library/react": "^15.0.7",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@types/three": "^0.161.0",
    "@vitejs/plugin-react": "^4.3.0",
    "jsdom": "^24.1.0",
    "typescript": "^5.4.5",
    "vite": "^5.2.11",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: TypeScript 설정 (`tsconfig.json` + `tsconfig.node.json`)**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts", "playwright.config.ts"]
}
```

- [ ] **Step 3: Vite + Vitest 설정 (`vite.config.ts`)**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포 시 base를 저장소 이름으로. 커스텀 도메인/Vercel이면 '/'.
export default defineConfig({
  base: process.env.DEPLOY_BASE ?? '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    exclude: ['**/node_modules/**', '**/tests/e2e/**'],
  },
})
```

- [ ] **Step 4: 테스트 setup + 진입 파일들**

`src/setupTests.ts`:
```ts
import '@testing-library/jest-dom'
```

`src/vite-env.d.ts`:
```ts
/// <reference types="vite/client" />
```

`index.html`:
```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>지구본 사회공부</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`src/main.tsx`:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

`src/App.tsx` (임시, Task 8에서 완성):
```tsx
export default function App() {
  return <h1>지구본 사회공부</h1>
}
```

- [ ] **Step 5: 스모크 테스트 작성 (`src/smoke.test.ts`)**

```ts
import { describe, it, expect } from 'vitest'

describe('toolchain', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 6: 설치하고 테스트 통과 확인**

Run: `npm install && npm test`
Expected: 스모크 테스트 1개 PASS, 실패 0.

- [ ] **Step 7: 빌드 확인**

Run: `npm run build`
Expected: 타입 에러 없이 `dist/` 생성.

- [ ] **Step 8: 커밋**

```bash
git add package.json package-lock.json tsconfig*.json vite.config.ts index.html src/main.tsx src/App.tsx src/vite-env.d.ts src/setupTests.ts src/smoke.test.ts
git commit -m "chore: scaffold vite+react+ts app with vitest"
```

---

### Task 2: 기후 타입·상수·데이터 조회 (순수 로직)

**Files:**
- Create: `src/climate/types.ts`, `src/climate/climate.json`, `src/climate/data.ts`
- Test: `src/climate/data.test.ts`

**Interfaces:**
- Consumes: 없음
- Produces:
  - `type ClimateGroup = '열대' | '건조' | '온대' | '냉대' | '한대' | '고산'`
  - `interface CountryClimate { nameKo: string; nameEn: string; group: ClimateGroup; subtype: string; note?: string }`
  - `type ClimateData = Record<string, CountryClimate>` (키: ISO alpha-2 대문자)
  - `const CLIMATE_GROUPS: { group: ClimateGroup; color: string }[]`
  - `function getCountryClimate(data: ClimateData, iso: string | null | undefined): CountryClimate | null`
  - `const climateData: ClimateData` (기본 export from `data.ts`)

- [ ] **Step 1: 타입과 상수 작성 (`src/climate/types.ts`)**

```ts
export type ClimateGroup = '열대' | '건조' | '온대' | '냉대' | '한대' | '고산'

export interface CountryClimate {
  nameKo: string
  nameEn: string
  group: ClimateGroup
  subtype: string
  note?: string
}

export type ClimateData = Record<string, CountryClimate>

// 대분류 6개와 지정 색(Global Constraints와 일치). 범례·텍스처 색 기준.
export const CLIMATE_GROUPS: { group: ClimateGroup; color: string }[] = [
  { group: '열대', color: '#1b7837' },
  { group: '건조', color: '#f2c744' },
  { group: '온대', color: '#91cf60' },
  { group: '냉대', color: '#4575b4' },
  { group: '한대', color: '#d9d9d9' },
  { group: '고산', color: '#8c6bb1' },
]

export function colorForGroup(group: ClimateGroup): string {
  const found = CLIMATE_GROUPS.find((g) => g.group === group)
  return found ? found.color : '#999999'
}
```

- [ ] **Step 2: 시드 데이터 작성 (`src/climate/climate.json`)**

교과서 대표국 + 주요국을 dominant 기후로 채운 시드. 구현 중 같은 형식으로 확장한다(키는 ISO alpha-2 대문자).

```json
{
  "KR": { "nameKo": "대한민국", "nameEn": "South Korea", "group": "온대", "subtype": "온난습윤", "note": "여름 덥고 습하며 겨울은 춥고 건조" },
  "JP": { "nameKo": "일본", "nameEn": "Japan", "group": "온대", "subtype": "온난습윤" },
  "CN": { "nameKo": "중국", "nameEn": "China", "group": "온대", "subtype": "온대겨울건조", "note": "국토가 넓어 건조·냉대 기후도 나타남" },
  "GB": { "nameKo": "영국", "nameEn": "United Kingdom", "group": "온대", "subtype": "서안해양성", "note": "편서풍과 난류로 연중 온화" },
  "IT": { "nameKo": "이탈리아", "nameEn": "Italy", "group": "온대", "subtype": "지중해성", "note": "여름 고온건조, 겨울 온난습윤" },
  "GR": { "nameKo": "그리스", "nameEn": "Greece", "group": "온대", "subtype": "지중해성" },
  "SA": { "nameKo": "사우디아라비아", "nameEn": "Saudi Arabia", "group": "건조", "subtype": "사막" },
  "EG": { "nameKo": "이집트", "nameEn": "Egypt", "group": "건조", "subtype": "사막" },
  "MN": { "nameKo": "몽골", "nameEn": "Mongolia", "group": "건조", "subtype": "스텝" },
  "BR": { "nameKo": "브라질", "nameEn": "Brazil", "group": "열대", "subtype": "사바나", "note": "아마존 일대는 열대우림" },
  "ID": { "nameKo": "인도네시아", "nameEn": "Indonesia", "group": "열대", "subtype": "열대우림" },
  "IN": { "nameKo": "인도", "nameEn": "India", "group": "열대", "subtype": "열대몬순", "note": "계절풍의 영향이 큼" },
  "KE": { "nameKo": "케냐", "nameEn": "Kenya", "group": "열대", "subtype": "사바나" },
  "RU": { "nameKo": "러시아", "nameEn": "Russia", "group": "냉대", "subtype": "냉대습윤", "note": "동시베리아는 냉대겨울건조" },
  "CA": { "nameKo": "캐나다", "nameEn": "Canada", "group": "냉대", "subtype": "냉대습윤" },
  "GL": { "nameKo": "그린란드", "nameEn": "Greenland", "group": "한대", "subtype": "빙설" }
}
```

- [ ] **Step 3: 실패하는 테스트 작성 (`src/climate/data.test.ts`)**

```ts
import { describe, it, expect } from 'vitest'
import { getCountryClimate } from './data'
import type { ClimateData } from './types'

const sample: ClimateData = {
  KR: { nameKo: '대한민국', nameEn: 'South Korea', group: '온대', subtype: '온난습윤' },
}

describe('getCountryClimate', () => {
  it('대문자 ISO 코드로 조회한다', () => {
    expect(getCountryClimate(sample, 'KR')?.group).toBe('온대')
  })
  it('소문자도 대문자로 정규화해 조회한다', () => {
    expect(getCountryClimate(sample, 'kr')?.nameKo).toBe('대한민국')
  })
  it('데이터가 없으면 null', () => {
    expect(getCountryClimate(sample, 'ZZ')).toBeNull()
  })
  it('null/undefined 입력이면 null', () => {
    expect(getCountryClimate(sample, null)).toBeNull()
    expect(getCountryClimate(sample, undefined)).toBeNull()
  })
})
```

- [ ] **Step 4: 실패 확인**

Run: `npm test -- src/climate/data.test.ts`
Expected: FAIL — `./data` 모듈 또는 `getCountryClimate`를 찾지 못함.

- [ ] **Step 5: 구현 (`src/climate/data.ts`)**

```ts
import raw from './climate.json'
import type { ClimateData, CountryClimate } from './types'

export const climateData: ClimateData = raw as ClimateData

export function getCountryClimate(
  data: ClimateData,
  iso: string | null | undefined,
): CountryClimate | null {
  if (!iso) return null
  return data[iso.toUpperCase()] ?? null
}
```

- [ ] **Step 6: 통과 확인**

Run: `npm test -- src/climate/data.test.ts`
Expected: 4개 PASS.

- [ ] **Step 7: 커밋**

```bash
git add src/climate
git commit -m "feat: climate types, seed data, and lookup"
```

---

### Task 3: Zustand 앱 스토어

**Files:**
- Create: `src/store.ts`
- Test: `src/store.test.ts`

**Interfaces:**
- Consumes: `ClimateGroup` from `src/climate/types.ts`
- Produces:
  - `type Mode = 'climate' | 'environment' | 'culture' | 'quiz'`
  - `useAppStore` (zustand hook) with state `{ mode: Mode; selectedIso: string | null; climateFilter: ClimateGroup | null }` and actions `setMode(m: Mode): void`, `selectCountry(iso: string | null): void`, `setClimateFilter(g: ClimateGroup | null): void`, `toggleClimateFilter(g: ClimateGroup): void`

- [ ] **Step 1: 실패하는 테스트 작성 (`src/store.test.ts`)**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from './store'

beforeEach(() => {
  useAppStore.setState({ mode: 'climate', selectedIso: null, climateFilter: null })
})

describe('useAppStore', () => {
  it('기본 모드는 climate', () => {
    expect(useAppStore.getState().mode).toBe('climate')
  })
  it('setMode로 모드를 바꾼다', () => {
    useAppStore.getState().setMode('quiz')
    expect(useAppStore.getState().mode).toBe('quiz')
  })
  it('selectCountry로 선택 나라를 설정/해제한다', () => {
    useAppStore.getState().selectCountry('KR')
    expect(useAppStore.getState().selectedIso).toBe('KR')
    useAppStore.getState().selectCountry(null)
    expect(useAppStore.getState().selectedIso).toBeNull()
  })
  it('toggleClimateFilter는 같은 그룹을 두 번 누르면 해제된다', () => {
    useAppStore.getState().toggleClimateFilter('온대')
    expect(useAppStore.getState().climateFilter).toBe('온대')
    useAppStore.getState().toggleClimateFilter('온대')
    expect(useAppStore.getState().climateFilter).toBeNull()
  })
})
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- src/store.test.ts`
Expected: FAIL — `./store`를 찾지 못함.

- [ ] **Step 3: 구현 (`src/store.ts`)**

```ts
import { create } from 'zustand'
import type { ClimateGroup } from './climate/types'

export type Mode = 'climate' | 'environment' | 'culture' | 'quiz'

interface AppState {
  mode: Mode
  selectedIso: string | null
  climateFilter: ClimateGroup | null
  setMode: (m: Mode) => void
  selectCountry: (iso: string | null) => void
  setClimateFilter: (g: ClimateGroup | null) => void
  toggleClimateFilter: (g: ClimateGroup) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  mode: 'climate',
  selectedIso: null,
  climateFilter: null,
  setMode: (mode) => set({ mode }),
  selectCountry: (selectedIso) => set({ selectedIso }),
  setClimateFilter: (climateFilter) => set({ climateFilter }),
  toggleClimateFilter: (g) =>
    set({ climateFilter: get().climateFilter === g ? null : g }),
}))
```

- [ ] **Step 4: 통과 확인**

Run: `npm test -- src/store.test.ts`
Expected: 4개 PASS.

- [ ] **Step 5: 커밋**

```bash
git add src/store.ts src/store.test.ts
git commit -m "feat: zustand app store (mode/selection/filter)"
```

---

### Task 4: 기후 범례 컴포넌트 (색+라벨+클릭 필터)

**Files:**
- Create: `src/components/Legend.tsx`
- Test: `src/components/Legend.test.tsx`

**Interfaces:**
- Consumes: `CLIMATE_GROUPS`, `ClimateGroup` from `src/climate/types.ts`; `useAppStore` from `src/store.ts`
- Produces: `function Legend(): JSX.Element` — 6개 기후 그룹을 색 스와치 + 텍스트 라벨 버튼으로 렌더. 클릭 시 `toggleClimateFilter`. 활성 항목은 `aria-pressed="true"`.

- [ ] **Step 1: 실패하는 테스트 작성 (`src/components/Legend.test.tsx`)**

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Legend } from './Legend'
import { useAppStore } from '../store'

beforeEach(() => {
  useAppStore.setState({ mode: 'climate', selectedIso: null, climateFilter: null })
})

describe('Legend', () => {
  it('6개 기후 대분류 라벨을 모두 텍스트로 보여준다', () => {
    render(<Legend />)
    for (const label of ['열대', '건조', '온대', '냉대', '한대', '고산']) {
      expect(screen.getByRole('button', { name: new RegExp(label) })).toBeInTheDocument()
    }
  })
  it('항목 클릭 시 스토어 필터가 설정된다', async () => {
    render(<Legend />)
    await userEvent.click(screen.getByRole('button', { name: /온대/ }))
    expect(useAppStore.getState().climateFilter).toBe('온대')
  })
  it('활성 항목은 aria-pressed=true', () => {
    useAppStore.setState({ climateFilter: '건조' })
    render(<Legend />)
    expect(screen.getByRole('button', { name: /건조/ })).toHaveAttribute('aria-pressed', 'true')
  })
})
```

참고: `userEvent`는 `@testing-library/user-event`에서 온다. Task 1의 devDependencies에 없으면 추가한다: `npm install -D @testing-library/user-event@^14.5.2` 후 커밋에 `package.json` 포함.

- [ ] **Step 2: 실패 확인**

Run: `npm test -- src/components/Legend.test.tsx`
Expected: FAIL — `./Legend`를 찾지 못함.

- [ ] **Step 3: 구현 (`src/components/Legend.tsx`)**

```tsx
import { CLIMATE_GROUPS } from '../climate/types'
import { useAppStore } from '../store'

export function Legend() {
  const climateFilter = useAppStore((s) => s.climateFilter)
  const toggle = useAppStore((s) => s.toggleClimateFilter)
  return (
    <div className="legend" role="group" aria-label="기후 범례">
      {CLIMATE_GROUPS.map(({ group, color }) => {
        const active = climateFilter === group
        return (
          <button
            key={group}
            type="button"
            className={`legend__item${active ? ' legend__item--active' : ''}`}
            aria-pressed={active}
            onClick={() => toggle(group)}
          >
            <span className="legend__swatch" style={{ backgroundColor: color }} aria-hidden="true" />
            <span className="legend__label">{group}</span>
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: 통과 확인**

Run: `npm test -- src/components/Legend.test.tsx`
Expected: 3개 PASS.

- [ ] **Step 5: 커밋**

```bash
git add src/components/Legend.tsx src/components/Legend.test.tsx package.json package-lock.json
git commit -m "feat: climate legend with color swatches and click filter"
```

---

### Task 5: 나라 기후 카드 컴포넌트

**Files:**
- Create: `src/components/InfoCard.tsx`
- Test: `src/components/InfoCard.test.tsx`

**Interfaces:**
- Consumes: `useAppStore`; `getCountryClimate`, `climateData` from `src/climate/data.ts`; `colorForGroup` from `src/climate/types.ts`
- Produces: `function InfoCard(): JSX.Element | null` — `selectedIso`가 null이면 `null` 렌더. 데이터가 있으면 나라명/기후 그룹·하위기후/note 표시. 선택됐지만 데이터가 없으면 "기후 정보 준비 중" 안내. 닫기 버튼은 `selectCountry(null)`.

- [ ] **Step 1: 실패하는 테스트 작성 (`src/components/InfoCard.test.tsx`)**

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InfoCard } from './InfoCard'
import { useAppStore } from '../store'

beforeEach(() => {
  useAppStore.setState({ mode: 'climate', selectedIso: null, climateFilter: null })
})

describe('InfoCard', () => {
  it('선택된 나라가 없으면 아무것도 렌더하지 않는다', () => {
    const { container } = render(<InfoCard />)
    expect(container).toBeEmptyDOMElement()
  })
  it('데이터가 있는 나라는 이름과 기후를 보여준다', () => {
    useAppStore.setState({ selectedIso: 'KR' })
    render(<InfoCard />)
    expect(screen.getByText('대한민국')).toBeInTheDocument()
    expect(screen.getByText(/온대/)).toBeInTheDocument()
    expect(screen.getByText(/온난습윤/)).toBeInTheDocument()
  })
  it('데이터가 없는 나라는 준비 중 안내를 보여준다', () => {
    useAppStore.setState({ selectedIso: 'ZZ' })
    render(<InfoCard />)
    expect(screen.getByText(/준비 중/)).toBeInTheDocument()
  })
  it('닫기 버튼은 선택을 해제한다', async () => {
    useAppStore.setState({ selectedIso: 'KR' })
    render(<InfoCard />)
    await userEvent.click(screen.getByRole('button', { name: /닫기/ }))
    expect(useAppStore.getState().selectedIso).toBeNull()
  })
})
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- src/components/InfoCard.test.tsx`
Expected: FAIL — `./InfoCard`를 찾지 못함.

- [ ] **Step 3: 구현 (`src/components/InfoCard.tsx`)**

```tsx
import { useAppStore } from '../store'
import { climateData, getCountryClimate } from '../climate/data'
import { colorForGroup } from '../climate/types'

export function InfoCard() {
  const selectedIso = useAppStore((s) => s.selectedIso)
  const select = useAppStore((s) => s.selectCountry)
  if (!selectedIso) return null

  const climate = getCountryClimate(climateData, selectedIso)

  return (
    <aside className="card" aria-label="나라 정보">
      <button type="button" className="card__close" onClick={() => select(null)}>
        닫기 ✕
      </button>
      {climate ? (
        <>
          <h2 className="card__title">
            {climate.nameKo} <span className="card__title-en">{climate.nameEn}</span>
          </h2>
          <div className="card__row">
            <span className="card__swatch" style={{ backgroundColor: colorForGroup(climate.group) }} aria-hidden="true" />
            <span className="card__climate">🌡️ {climate.group} · {climate.subtype}</span>
          </div>
          {climate.note && <p className="card__note">{climate.note}</p>}
        </>
      ) : (
        <p className="card__empty">이 나라의 기후 정보는 준비 중이에요. 지구본 색으로 기후대를 확인해 보세요.</p>
      )}
    </aside>
  )
}
```

- [ ] **Step 4: 통과 확인**

Run: `npm test -- src/components/InfoCard.test.tsx`
Expected: 4개 PASS.

- [ ] **Step 5: 커밋**

```bash
git add src/components/InfoCard.tsx src/components/InfoCard.test.tsx
git commit -m "feat: country climate info card"
```

---

### Task 6: 모드 전환 버튼

**Files:**
- Create: `src/components/ModeSwitcher.tsx`
- Test: `src/components/ModeSwitcher.test.tsx`

**Interfaces:**
- Consumes: `useAppStore`, `Mode` from `src/store.ts`
- Produces: `function ModeSwitcher(): JSX.Element` — 4개 버튼(기후/환경/문화/퀴즈). 현재 모드는 `aria-pressed="true"`. 클릭 시 `setMode`. MVP에서 environment/culture/quiz는 아직 미구현이므로 클릭은 되지만 GlobeView가 기후만 표시(다음 단계에서 확장).

- [ ] **Step 1: 실패하는 테스트 작성 (`src/components/ModeSwitcher.test.tsx`)**

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModeSwitcher } from './ModeSwitcher'
import { useAppStore } from '../store'

beforeEach(() => {
  useAppStore.setState({ mode: 'climate', selectedIso: null, climateFilter: null })
})

describe('ModeSwitcher', () => {
  it('4개 모드 버튼을 보여준다', () => {
    render(<ModeSwitcher />)
    for (const label of ['기후', '환경', '문화', '퀴즈']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })
  it('현재 모드 버튼은 aria-pressed=true', () => {
    render(<ModeSwitcher />)
    expect(screen.getByRole('button', { name: '기후' })).toHaveAttribute('aria-pressed', 'true')
  })
  it('버튼 클릭 시 모드가 바뀐다', async () => {
    render(<ModeSwitcher />)
    await userEvent.click(screen.getByRole('button', { name: '퀴즈' }))
    expect(useAppStore.getState().mode).toBe('quiz')
  })
})
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- src/components/ModeSwitcher.test.tsx`
Expected: FAIL — `./ModeSwitcher`를 찾지 못함.

- [ ] **Step 3: 구현 (`src/components/ModeSwitcher.tsx`)**

```tsx
import { useAppStore, type Mode } from '../store'

const MODES: { mode: Mode; label: string }[] = [
  { mode: 'climate', label: '기후' },
  { mode: 'environment', label: '환경' },
  { mode: 'culture', label: '문화' },
  { mode: 'quiz', label: '퀴즈' },
]

export function ModeSwitcher() {
  const mode = useAppStore((s) => s.mode)
  const setMode = useAppStore((s) => s.setMode)
  return (
    <nav className="modes" aria-label="모드 전환">
      {MODES.map(({ mode: m, label }) => (
        <button
          key={m}
          type="button"
          className={`modes__btn${mode === m ? ' modes__btn--active' : ''}`}
          aria-pressed={mode === m}
          onClick={() => setMode(m)}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
```

- [ ] **Step 4: 통과 확인**

Run: `npm test -- src/components/ModeSwitcher.test.tsx`
Expected: 3개 PASS.

- [ ] **Step 5: 커밋**

```bash
git add src/components/ModeSwitcher.tsx src/components/ModeSwitcher.test.tsx
git commit -m "feat: mode switcher buttons"
```

---

### Task 7: GeoJSON feature → ISO 추출 (순수 함수)

**Files:**
- Create: `src/globe/featureIso.ts`
- Test: `src/globe/featureIso.test.ts`

**Interfaces:**
- Consumes: 없음
- Produces: `function featureToIso(feature: unknown): string | null` — Natural Earth feature의 `properties`에서 ISO alpha-2를 대문자로 뽑아낸다. `ISO_A2` → `ISO_A2_EH` → 없으면 null. `'-99'`/빈 값은 null 처리.

- [ ] **Step 1: 실패하는 테스트 작성 (`src/globe/featureIso.test.ts`)**

```ts
import { describe, it, expect } from 'vitest'
import { featureToIso } from './featureIso'

describe('featureToIso', () => {
  it('ISO_A2를 대문자로 반환한다', () => {
    expect(featureToIso({ properties: { ISO_A2: 'kr' } })).toBe('KR')
  })
  it('ISO_A2가 -99이면 ISO_A2_EH로 폴백한다', () => {
    expect(featureToIso({ properties: { ISO_A2: '-99', ISO_A2_EH: 'FR' } })).toBe('FR')
  })
  it('식별 불가하면 null', () => {
    expect(featureToIso({ properties: { ISO_A2: '-99' } })).toBeNull()
    expect(featureToIso({})).toBeNull()
    expect(featureToIso(null)).toBeNull()
  })
})
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- src/globe/featureIso.test.ts`
Expected: FAIL — `./featureIso`를 찾지 못함.

- [ ] **Step 3: 구현 (`src/globe/featureIso.ts`)**

```ts
function clean(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const up = v.trim().toUpperCase()
  if (up === '' || up === '-99') return null
  return up
}

export function featureToIso(feature: unknown): string | null {
  if (!feature || typeof feature !== 'object') return null
  const props = (feature as { properties?: Record<string, unknown> }).properties
  if (!props) return null
  return clean(props.ISO_A2) ?? clean(props.ISO_A2_EH)
}
```

- [ ] **Step 4: 통과 확인**

Run: `npm test -- src/globe/featureIso.test.ts`
Expected: 3개 PASS.

- [ ] **Step 5: 커밋**

```bash
git add src/globe/featureIso.ts src/globe/featureIso.test.ts
git commit -m "feat: extract ISO alpha-2 from geojson feature"
```

---

### Task 8: 지구본 애셋 준비 (기후 텍스처 + 국경 GeoJSON)

**Files:**
- Create: `public/textures/koppen.png`, `public/data/countries.geojson`
- Create: `scripts/README.md` (애셋 출처·재현 방법 기록)

**Interfaces:**
- Consumes: 없음
- Produces: 앱이 fetch할 정적 애셋 두 개. `countries.geojson`은 `FeatureCollection`이고 각 feature의 `properties`에 `ISO_A2`(및 가능하면 `ISO_A2_EH`)를 포함한다.

- [ ] **Step 1: 국경 GeoJSON 내려받기**

Natural Earth 1:110m Admin 0 Countries(퍼블릭 도메인)를 GeoJSON으로 받는다. 검증된 미러:
Run:
```bash
mkdir -p public/data public/textures scripts
curl -L -o public/data/countries.geojson \
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson"
```
Expected: 수백 KB 파일 생성.

- [ ] **Step 2: GeoJSON에 ISO 속성이 있는지 확인**

Run:
```bash
node -e "const g=require('./public/data/countries.geojson'); const p=g.features[0].properties; console.log('keys with ISO:', Object.keys(p).filter(k=>/ISO_A2/i.test(k))); console.log('type', g.type, 'features', g.features.length)"
```
Expected: `ISO_A2`, `ISO_A2_EH` 등 키가 출력되고 `type FeatureCollection`, feature 수 170+.
확인: `featureToIso`가 참조하는 키(`ISO_A2`/`ISO_A2_EH`)와 실제 속성명이 일치하는지 본다. 다르면 Task 7의 `featureToIso`를 실제 키명으로 수정하고 그 테스트도 갱신한 뒤 재커밋한다.

- [ ] **Step 3: 기후 텍스처 준비 (등장방형 PNG)**

공개 쾨펜-가이거 기후 지도(등장방형, 경도 -180~180 / 위도 -90~90)를 구해 `public/textures/koppen.png`로 저장한다. 색을 Global Constraints의 6색 팔레트로 재채색한다(이미지 편집 또는 팔레트 매핑 스크립트). MVP 임시로는 재채색 전 원본을 넣어 배치·투영을 먼저 검증하고, 재채색은 같은 태스크 내에서 마무리한다.

검증(육안): 텍스처를 뷰어로 열어 적도 부근이 열대색, 사하라·아라비아가 건조색, 북반구 고위도가 냉대·한대색인지 확인.

- [ ] **Step 4: 출처 기록 (`scripts/README.md`)**

```md
# 데이터 애셋 출처

- public/data/countries.geojson
  - Natural Earth 1:110m Admin 0 Countries (public domain)
  - https://github.com/nvkelso/natural-earth-vector (geojson/ne_110m_admin_0_countries.geojson)
- public/textures/koppen.png
  - 공개 쾨펜-가이거 기후 지도(등장방형)를 6색 팔레트(열대/건조/온대/냉대/한대/고산)로 재채색
  - 투영: equirectangular, 경도 -180~180, 위도 -90~90
```

- [ ] **Step 5: 커밋**

```bash
git add public/data/countries.geojson public/textures/koppen.png scripts/README.md
git commit -m "chore: add koppen climate texture and country borders geojson"
```

---

### Task 9: GlobeView 컴포넌트 (globe.gl 래퍼)

**Files:**
- Create: `src/globe/GlobeView.tsx`
- Test: (단위테스트 없음 — WebGL은 jsdom 불가. Task 11 E2E로 검증)

**Interfaces:**
- Consumes: `useAppStore`; `featureToIso` from `src/globe/featureIso.ts`; `climateData`, `getCountryClimate` from `src/climate/data.ts`; `colorForGroup` from `src/climate/types.ts`
- Produces: `function GlobeView(): JSX.Element` — 컨테이너 div에 globe.gl 인스턴스를 마운트한다. 텍스처 지구본 + 투명 국경 폴리곤(클릭 히트용). 나라 클릭 → `selectCountry(iso)`. 기후 필터가 걸리면 해당 그룹 나라 폴리곤만 강조(테두리/살짝 채움), 나머지는 투명. 컨테이너에 `data-testid="globe"`.

- [ ] **Step 1: 구현 (`src/globe/GlobeView.tsx`)**

```tsx
import { useEffect, useRef } from 'react'
import Globe, { type GlobeInstance } from 'globe.gl'
import { useAppStore } from '../store'
import { featureToIso } from './featureIso'
import { climateData, getCountryClimate } from '../climate/data'
import { colorForGroup } from '../climate/types'

const TEXTURE_URL = `${import.meta.env.BASE_URL}textures/koppen.png`
const GEOJSON_URL = `${import.meta.env.BASE_URL}data/countries.geojson`

export function GlobeView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<GlobeInstance | null>(null)

  // 마운트: 지구본 생성 + 국경 로딩. 한 번만.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const globe = Globe()(el)
      .globeImageUrl(TEXTURE_URL)
      .backgroundColor('#0b1a2b')
      .polygonAltitude(0.006)
      .polygonCapColor(() => 'rgba(0,0,0,0)')
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => 'rgba(255,255,255,0.15)')
      .onPolygonClick((feat: object) => {
        useAppStore.getState().selectCountry(featureToIso(feat))
      })
    globeRef.current = globe

    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((geo: { features: object[] }) => globe.polygonsData(geo.features))
      .catch(() => {
        el.setAttribute('data-globe-error', 'true')
      })

    const onResize = () => {
      globe.width(el.clientWidth).height(el.clientHeight)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      globe._destructor?.()
      el.innerHTML = ''
    }
  }, [])

  // 기후 필터 변경 시 폴리곤 강조 갱신.
  const climateFilter = useAppStore((s) => s.climateFilter)
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    globe
      .polygonCapColor((feat: object) => {
        if (!climateFilter) return 'rgba(0,0,0,0)'
        const c = getCountryClimate(climateData, featureToIso(feat))
        return c?.group === climateFilter ? `${colorForGroup(climateFilter)}cc` : 'rgba(0,0,0,0)'
      })
      .polygonStrokeColor((feat: object) => {
        if (!climateFilter) return 'rgba(255,255,255,0.15)'
        const c = getCountryClimate(climateData, featureToIso(feat))
        return c?.group === climateFilter ? '#ffffff' : 'rgba(255,255,255,0.05)'
      })
  }, [climateFilter])

  return <div ref={containerRef} data-testid="globe" className="globe" />
}
```

참고: globe.gl 타입 export명(`GlobeInstance`)과 `_destructor` 존재 여부는 설치된 버전에서 확인한다. 타입이 다르면 `ReturnType<typeof Globe>`로 대체하고, 정리 함수가 없으면 `el.innerHTML = ''`만 남긴다.

- [ ] **Step 2: 타입체크/빌드 확인**

Run: `npm run build`
Expected: 타입 에러 없이 빌드 성공. (globe.gl 타입 이슈가 있으면 위 참고대로 조정 후 재빌드)

- [ ] **Step 3: 커밋**

```bash
git add src/globe/GlobeView.tsx
git commit -m "feat: globe.gl view with climate texture and country picking"
```

---

### Task 10: 앱 셸 조립 + 반응형 레이아웃

**Files:**
- Modify: `src/App.tsx`
- Create: `src/App.css`
- Modify: `src/main.tsx` (CSS import)
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `GlobeView`, `ModeSwitcher`, `Legend`, `InfoCard`, `useAppStore`
- Produces: 최종 `App` — 상단바(제목+ModeSwitcher), 본문(GlobeView + Legend 오버레이), 사이드/하단 InfoCard. 반응형은 CSS로.

- [ ] **Step 1: 실패하는 테스트 작성 (`src/App.test.tsx`)**

GlobeView는 jsdom에서 WebGL을 못 쓰므로 mock한다.
```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useAppStore } from './store'

vi.mock('./globe/GlobeView', () => ({ GlobeView: () => <div data-testid="globe" /> }))

import App from './App'

beforeEach(() => {
  useAppStore.setState({ mode: 'climate', selectedIso: null, climateFilter: null })
})

describe('App', () => {
  it('제목·모드 전환·범례·지구본을 렌더한다', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: '기후' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: '기후 범례' })).toBeInTheDocument()
    expect(screen.getByTestId('globe')).toBeInTheDocument()
  })
  it('나라가 선택되면 카드가 나타난다', () => {
    useAppStore.setState({ selectedIso: 'KR' })
    render(<App />)
    expect(screen.getByText('대한민국')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: 실패 확인**

Run: `npm test -- src/App.test.tsx`
Expected: FAIL — App이 아직 컴포넌트를 조립하지 않음.

- [ ] **Step 3: 구현 (`src/App.tsx`)**

```tsx
import { GlobeView } from './globe/GlobeView'
import { ModeSwitcher } from './components/ModeSwitcher'
import { Legend } from './components/Legend'
import { InfoCard } from './components/InfoCard'
import { useAppStore } from './store'

export default function App() {
  const mode = useAppStore((s) => s.mode)
  return (
    <div className="app">
      <header className="app__bar">
        <h1 className="app__title">🌍 지구본 사회공부</h1>
        <ModeSwitcher />
      </header>
      <main className="app__main">
        <div className="app__globe">
          <GlobeView />
          {mode === 'climate' && (
            <div className="app__legend">
              <Legend />
            </div>
          )}
        </div>
        <InfoCard />
      </main>
    </div>
  )
}
```

- [ ] **Step 4: 반응형 CSS (`src/App.css`)**

```css
* { box-sizing: border-box; }
html, body, #root { margin: 0; height: 100%; }
body { font-family: system-ui, -apple-system, "Apple SD Gothic Neo", sans-serif; }

.app { display: flex; flex-direction: column; height: 100vh; background: #0b1a2b; color: #eef; }
.app__bar { display: flex; align-items: center; gap: 16px; padding: 8px 16px; background: #10233a; }
.app__title { font-size: 18px; margin: 0; white-space: nowrap; }
.modes { display: flex; gap: 6px; }
.modes__btn { padding: 6px 12px; border: 1px solid #2a4a6b; border-radius: 999px; background: transparent; color: #cde; cursor: pointer; }
.modes__btn--active { background: #2f6fb0; color: #fff; border-color: #2f6fb0; }

.app__main { flex: 1; display: flex; min-height: 0; }
.app__globe { position: relative; flex: 1; min-width: 0; }
.globe { width: 100%; height: 100%; }
.app__legend { position: absolute; left: 12px; bottom: 12px; background: rgba(16,35,58,0.85); padding: 8px; border-radius: 8px; }

.legend { display: flex; flex-wrap: wrap; gap: 6px; max-width: 320px; }
.legend__item { display: flex; align-items: center; gap: 6px; padding: 4px 8px; border: 1px solid transparent; border-radius: 6px; background: transparent; color: #eef; cursor: pointer; }
.legend__item--active { border-color: #fff; background: rgba(255,255,255,0.12); }
.legend__swatch, .card__swatch { width: 14px; height: 14px; border-radius: 3px; display: inline-block; }

.card { width: 320px; background: #10233a; padding: 16px; overflow-y: auto; }
.card__close { float: right; background: transparent; border: none; color: #9bd; cursor: pointer; }
.card__title { font-size: 20px; margin: 0 0 12px; }
.card__title-en { font-size: 13px; color: #9ab; }
.card__row { display: flex; align-items: center; gap: 8px; }
.card__note, .card__empty { color: #bcd; line-height: 1.5; }

@media (max-width: 767px) {
  .app__main { flex-direction: column; }
  .card { position: fixed; left: 0; right: 0; bottom: 0; width: 100%; max-height: 45vh; border-radius: 16px 16px 0 0; }
}
```

- [ ] **Step 5: CSS import (`src/main.tsx`에 한 줄 추가)**

`import './App.css'`를 `import App from './App'` 아래에 추가.

주의: `.card` 사이드패널은 PC에서 `.app__main`의 flex 자식으로 우측에 붙고, 모바일(<768px)에서는 `position: fixed`로 하단 슬라이드업이 된다. `.modes__btn` 테두리 색은 `#2a4a6b`.

- [ ] **Step 6: 통과 확인**

Run: `npm test -- src/App.test.tsx`
Expected: 2개 PASS.

- [ ] **Step 7: 전체 단위테스트 + 빌드**

Run: `npm test && npm run build`
Expected: 모든 테스트 PASS, 빌드 성공.

- [ ] **Step 8: 개발 서버에서 육안 확인**

Run: `npm run dev` 후 브라우저에서 지구본 회전/확대, 나라 클릭 시 카드, 범례 클릭 시 해당 기후대 강조를 확인.

- [ ] **Step 9: 커밋**

```bash
git add src/App.tsx src/App.css src/main.tsx src/App.test.tsx
git commit -m "feat: assemble responsive app shell"
```

---

### Task 11: E2E 테스트 (Playwright)

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/mvp.spec.ts`

**Interfaces:**
- Consumes: 빌드된 앱(preview 서버)
- Produces: 실제 브라우저에서 로딩·모드·범례·클릭을 검증하는 E2E.

- [ ] **Step 1: Playwright 설정 (`playwright.config.ts`)**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: { baseURL: 'http://localhost:4173' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
})
```

- [ ] **Step 2: 브라우저 설치**

Run: `npx playwright install chromium`
Expected: Chromium 설치 완료.

- [ ] **Step 3: E2E 테스트 작성 (`tests/e2e/mvp.spec.ts`)**

```ts
import { test, expect } from '@playwright/test'

test('앱이 로딩되고 핵심 UI가 보인다', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /지구본 사회공부/ })).toBeVisible()
  for (const label of ['기후', '환경', '문화', '퀴즈']) {
    await expect(page.getByRole('button', { name: label })).toBeVisible()
  }
  await expect(page.getByTestId('globe')).toBeVisible()
})

test('기후 범례 6개가 텍스트 라벨과 함께 보이고 클릭하면 활성화된다', async ({ page }) => {
  await page.goto('/')
  for (const label of ['열대', '건조', '온대', '냉대', '한대', '고산']) {
    await expect(page.getByRole('button', { name: new RegExp(label) })).toBeVisible()
  }
  const target = page.getByRole('button', { name: /온대/ })
  await target.click()
  await expect(target).toHaveAttribute('aria-pressed', 'true')
})

test('globe canvas가 그려진다', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="globe"] canvas')).toBeVisible({ timeout: 15_000 })
})
```

- [ ] **Step 4: E2E 실행**

Run: `npm run e2e`
Expected: desktop·mobile 프로젝트에서 3개 테스트 PASS.

- [ ] **Step 5: 커밋**

```bash
git add playwright.config.ts tests/e2e/mvp.spec.ts package.json
git commit -m "test: e2e for load, legend, and globe canvas"
```

---

### Task 12: Vercel 배포

**Files:**
- Create: `vercel.json`
- Create: `docs/DEPLOY.md` (배포 방법 안내)

**Interfaces:**
- Consumes: `npm run build` (출력 `dist`), `vite.config.ts`의 base(기본 `/`)
- Produces: Vercel에 바로 배포 가능한 정적 설정 + 배포 절차 문서.

**배경:** Vercel은 도메인 루트(`/`)에서 앱을 서빙하므로 GitHub Pages와 달리 base 프리픽스가 필요 없다. `vite.config.ts`의 base 기본값 `/`가 그대로 맞다(`DEPLOY_BASE` 미설정). Vercel은 Vite 프레임워크를 자동 감지하지만, 빌드 설정과 SPA 폴백을 명시하기 위해 `vercel.json`을 커밋한다.

- [ ] **Step 1: `vercel.json` 작성**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
참고: 단일 페이지 앱이라 모든 경로를 `index.html`로 되돌리는 rewrite를 둔다. 정적 애셋(`/textures/*`, `/data/*`, `/assets/*`)은 Vercel이 실제 파일을 먼저 찾으므로 rewrite보다 우선한다.

- [ ] **Step 2: 루트 base로 빌드 검증**

Run: `npm run build && npm run preview -- --port 4173`
Expected: 애셋이 루트 경로(`/textures/koppen.png`, `/data/countries.geojson`, `/assets/*`)에서 정상 로딩(콘솔 404 없음). `import.meta.env.BASE_URL`이 `/`이므로 GlobeView의 fetch 경로가 `/textures/...`, `/data/...`로 뜬다.

- [ ] **Step 3: 배포 절차 문서 작성 (`docs/DEPLOY.md`)**

```md
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
```

- [ ] **Step 4: 배포 설정 로컬 확인**

Run: `npx vercel build` (설치돼 있지 않으면 npx가 임시 설치). 
Expected: `.vercel/output/`이 생성되고 에러 없이 끝남. (실제 원격 배포는 로그인이 필요한 사용자 작업이므로 여기서는 빌드 산출물 생성까지만 확인한다. `npx vercel build`가 로그인/네트워크를 요구해 실패하면 Step 2의 `npm run build` 성공으로 대체하고 그 사실을 기록한다.)

- [ ] **Step 5: 커밋**

```bash
git add vercel.json docs/DEPLOY.md
git commit -m "chore: add vercel deploy config and instructions"
```

- [ ] **Step 6: (사용자 작업) 실제 배포**

`docs/DEPLOY.md`의 방법 A(대시보드에서 저장소 import) 또는 방법 B(`npx vercel --prod`)로 배포한다. CLI 로그인은 대화형이라 사용자가 직접 실행한다.

---

## 이후 단계 (별도 계획서로 진행)

MVP 완성·배포 후 아래를 각각 별도 계획서로 작성한다. 각 단계는 이 MVP의 스토어/컴포넌트 구조 위에 레이어를 추가하는 방식이며, 독립적으로 동작·테스트 가능하다.

- **2단계 — 환경문제 모드**: `environment.json`(문제·지역·연결협약), 지역 하이라이트/아이콘 레이어, `DetailPanel`(원인·영향·관련 협약). 스펙 5.2 + 협약 매핑 표 구현.
- **3단계 — 문화 모드**: `culture.json`(축제 6·가옥·종교·의식주), 축제/가옥 핀, 종교 권역 오버레이(하위 토글), 카드의 기후–문화 연결 문장.
- **4단계 — 퀴즈 모드**: `quiz.json` 템플릿 + 기존 데이터로 문제 자동 생성, `QuizPanel`(5유형·채점·해설·점수).

---

## Self-Review

**1. 스펙 커버리지 (MVP 범위 한정)**
- 3D 지구본 + 쾨펜 기후대 텍스처 → Task 8, 9 ✓
- 실제 기후대 경계선 색칠(나라 단색 아님) → Task 8(텍스처가 기후대 경계 표현), Task 9(텍스처 매핑) ✓
- 나라 클릭 카드(기후) → Task 5, 9 ✓
- 범례 클릭으로 기후대 강조 → Task 4, 9 ✓
- 대표국은 채우고 일반국은 기후만/조용히 비움 → Task 5(데이터 없으면 준비 중 안내) ✓
- 반응형 PC/모바일 → Task 10 CSS + Task 11 mobile 프로젝트 ✓
- 색맹 배려(색+텍스트) → Task 4, 5 ✓
- 모드 전환 UI(환경/문화/퀴즈는 다음 단계) → Task 6 ✓
- 정적 배포 → Task 12 ✓
- 오류 처리(로딩 실패/바다 클릭) → Task 9(fetch catch로 `data-globe-error`), Task 5(선택 null 시 카드 없음) ✓ (모드 미구현 클릭은 기후만 표시로 자연 처리)
- 테스트(단위/컴포넌트/E2E) → Task 2·3·4·5·6·7(단위/컴포넌트), 11(E2E) ✓
- 환경·문화·퀴즈 상세, 협약 매핑 → 명시적으로 이후 단계로 이관(스코프 밖) ✓

**2. 플레이스홀더 스캔:** 각 코드 스텝에 실제 코드가 있음. 데이터 생성(Task 8)은 명령·검증·출처를 구체화했고, 시드 데이터(Task 2)는 실제 값 제공. TBD/TODO 없음.

**3. 타입 일관성:** `ClimateGroup`/`CountryClimate`/`ClimateData`(Task 2)를 store(Task 3)·Legend(Task 4)·InfoCard(Task 5)·GlobeView(Task 9)가 동일 시그니처로 사용. `getCountryClimate(data, iso)`, `colorForGroup(group)`, `featureToIso(feature)`, `useAppStore` 액션명(`setMode`/`selectCountry`/`toggleClimateFilter`/`setClimateFilter`)이 정의와 사용처에서 일치. `Mode`는 store에서 정의하고 ModeSwitcher가 import.

**주의 사항(구현 중 검증 필요):**
- globe.gl 설치 버전의 타입 export명(`GlobeInstance`)과 정리 함수(`_destructor`) 존재 여부 — Task 9 참고대로 조정.
- Natural Earth GeoJSON의 실제 ISO 속성 키명 — Task 8 Step 2에서 확인 후 필요 시 Task 7 조정.
- 기후 텍스처 재채색 결과의 육안 정확도 — Task 8 Step 3.
