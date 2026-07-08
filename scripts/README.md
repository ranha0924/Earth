# 데이터 애셋 출처

- `public/data/countries.geojson`
  - Natural Earth 1:110m Admin 0 Countries (public domain)
  - https://github.com/nvkelso/natural-earth-vector (geojson/ne_110m_admin_0_countries.geojson)
  - 177 features, `FeatureCollection`. 각 feature의 `properties.ISO_A2` / `properties.ISO_A2_EH`가
    `src/globe/featureIso.ts`의 `featureToIso`가 읽는 키와 정확히 일치함을 확인함 (KR/JP/BR/RU 등 스팟체크 완료).

- `public/textures/koppen.png`
  - Beck, H.E., Zimmermann, N. E., McVicar, T. R., Vergopolan, N., Berg, A., & Wood, E. F. (2018)
    "Köppen-Geiger Climate Classification Map (1980–2016) no borders"
  - 출처: Wikimedia Commons
    https://commons.wikimedia.org/wiki/File:K%C3%B6ppen-Geiger_Climate_Classification_Map_(1980%E2%80%932016)_no_borders.png
  - 라이선스: CC BY-SA 4.0 (저작자 표시 필요: Beck, H.E. et al. 2018 update)
  - 투영: equirectangular, 4320×2160px (2:1), 경도 -180~180, 위도 -90~90
  - `public/textures/koppen-standard.png`는 위 원본(Beck et al. 표준 팔레트, 재채색 전) 백업본이다.
    복원이 필요하면 `cp public/textures/koppen-standard.png public/textures/koppen.png`.
  - **재채색 완료**: `public/textures/koppen.png`는 `scripts/recolor-koppen.mjs`로
    앱의 6색 범례 팔레트에 맞게 재채색되었다 (원본 표준 팔레트는 `koppen-standard.png`에 보존).
    재현하려면 `node scripts/recolor-koppen.mjs` (전체 재채색), `--inspect` (원본의 지배적 색상
    빈도 출력), `--verify` (아래 스팟체크 지점 픽셀 색상 출력) 옵션을 사용한다.

  - **원본 Köppen-Geiger 30-class 팔레트 → 앱 6-group 팔레트 매핑**
    (원본 `koppen-standard.png`를 스캔하면 정확히 31개의 서로 다른 색상이 나오며 — 30개 클래스 +
    투명 배경(바다/no-data) — 안티앨리어싱된 픽셀은 없다. 아래 표는 Beck et al. 2018 표준 범례
    RGB 값이며, 스캔된 빈도와 정확히 일치함을 확인했다.):

    | Köppen group | classes (표준 RGB) | 앱 그룹 | 앱 색상 |
    |---|---|---|---|
    | A 열대 | Af `(0,0,255)`, Am `(0,120,255)`, Aw/As `(70,170,250)` | 열대 | `#1b7837` |
    | B 건조 | BWh `(255,0,0)`, BWk `(255,150,150)`, BSh `(245,165,0)`, BSk `(255,220,100)` | 건조 | `#f2c744` |
    | C 온대 | Csa `(255,255,0)`, Csb `(200,200,0)`, Csc `(150,150,0)`, Cwa `(150,255,150)`, Cwb `(100,200,100)`, Cwc `(50,150,50)`, Cfa `(200,255,80)`, Cfb `(100,255,80)`, Cfc `(50,200,0)` | 온대 | `#91cf60` |
    | D 냉대/대륙성 | Dsa `(255,0,255)`, Dsb `(200,0,200)`, Dsc `(150,50,150)`, Dsd `(150,100,150)`, Dwa `(170,175,255)`, Dwb `(89,120,220)`, Dwc `(75,80,179)`, Dwd `(50,0,135)`, Dfa `(0,255,255)`, Dfb `(55,200,255)`, Dfc `(0,125,125)`, Dfd `(0,70,95)` | 냉대 | `#4575b4` |
    | E 한대 | ET `(178,178,178)`, EF `(102,102,102)` | 한대 | `#d9d9d9` |
    | (없음) | Köppen-Geiger에는 고산/highland 전용 클래스가 없다 | 고산 | 이 지도에는 고산 픽셀이 존재하지 않음(정상) |
    | 바다/no-data | 투명 `(0,0,0,0)` (혹은 거의 흰색 불투명 픽셀) | — | 원본 그대로 보존 (바다색 유지, 재채색하지 않음) |

  - 스팟체크 (lat/lng → 픽셀 `x=(lng+180)/360*W`, `y=(90-lat)/180*H`, `scripts/recolor-koppen.mjs --verify`로 재현 가능):
    아마존(-3,-60)→`#1b7837`, 사하라(23,13)→`#f2c744`, 서유럽/프랑스(47,2)→`#91cf60`,
    중앙시베리아(63,100)→`#4575b4`, 남극(-80,0)→`#d9d9d9`, 중태평양(0,-140)→투명(바다, 보존).
