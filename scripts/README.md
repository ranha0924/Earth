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
  - 색상: 원본 Beck et al. 팔레트 그대로 사용 (재채색 미적용, MVP 배치·투영 검증 목적).
    파랑=열대우림(Af), 빨강=사막(BWh), 하늘색=온난습윤/서안해양성(Cfa/Cfb), 청록=아한대(Dfc 등),
    회색=툰드라(ET), 검정=빙설(EF) 등 Köppen 대분류별 관례색을 사용.
  - **주의(팔로우업 필요)**: 이 텍스처의 색상은 `src/globe/legend`(혹은 Legend 컴포넌트)의 6색 커스텀
    팔레트(열대 #1b7837, 건조/온대/냉대/한대/고산)와 아직 매핑되어 있지 않다. 텍스처↔범례 색상 정합은
    별도 폴리시 태스크에서 픽셀 재채색 또는 룩업 테이블로 처리할 것.
