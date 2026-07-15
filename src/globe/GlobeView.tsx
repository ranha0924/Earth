import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import Globe, { type GlobeInstance } from 'globe.gl'
import { useAppStore } from '../store'
import { featureToIso } from './featureIso'
import type { ClimateGroup } from '../climate/types'
import { SUBTYPE_BY_KO } from '../climate/subtypes'
import { getReligion } from '../culture/data'
import { colorForReligion, type ReligionId } from '../culture/types'
import { getRegion, colorForRegion, type RegionId } from '../culture/regions'
import { ISSUE_BY_ID, TREATY_BY_ID } from '../environment/data'
import { FESTIVALS, FESTIVAL_BY_ID } from '../culture/festivals'
import { HIGHLANDS, HIGHLAND_BY_ID } from '../climate/highlands'
import type { TreatyId } from '../environment/types'

const GEOJSON_URL = `${import.meta.env.BASE_URL}data/countries.geojson`
// 기후 모드: 실제 쾨펜 기후 지도 텍스처 (교과서 14색으로 재채색, 한 나라 안의 여러 기후 표시)
const CLIMATE_TEXTURE_URL = `${import.meta.env.BASE_URL}textures/koppen.png`
const TRANSPARENT = 'rgba(0,0,0,0)'

// 빈티지 아틀라스 팔레트 (App.css 토큰과 일치)
const PAPER = '#f5f0e4'
const OCEAN = '#ece1c6'
const LAND = '#d6c9a8' // 중립 육지 (미매핑국·기타)
const LAND_DIM = '#ddd4bd' // 흐림 처리
const INK_STROKE = 'rgba(26,46,42,0.6)'
const INK_STROKE_FAINT = 'rgba(26,46,42,0.28)'
const VERMILLION = '#c8452c'

const FLY_MS = 900

// 30°(위) / 20°(경) 간격 경위선 — pathsData로 직접 그려 색·굵기 제어
function buildGraticules(): [number, number][][] {
  const paths: [number, number][][] = []
  for (let lng = -180; lng < 180; lng += 20) {
    const line: [number, number][] = []
    for (let lat = -80; lat <= 80; lat += 4) line.push([lat, lng])
    paths.push(line)
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const line: [number, number][] = []
    for (let lng = -180; lng <= 180; lng += 4) line.push([lat, lng])
    paths.push(line)
  }
  return paths
}
const GRATICULES = buildGraticules()

// 기후 대분류별 대표 지역 (범례 클릭 시 이동)
const CLIMATE_FOCUS: Record<ClimateGroup, { lat: number; lng: number; altitude: number }> = {
  열대: { lat: 0, lng: 18, altitude: 2.1 },
  건조: { lat: 23, lng: 13, altitude: 2 },
  온대: { lat: 40, lng: 12, altitude: 1.9 },
  냉대: { lat: 60, lng: 95, altitude: 2 },
  한대: { lat: 74, lng: -42, altitude: 2 },
  고산: { lat: -15, lng: -70, altitude: 1.9 },
}

// 협약 채택지 (연표 클릭 시 이동)
const TREATY_FOCUS: Record<TreatyId, { lat: number; lng: number }> = {
  ramsar: { lat: 36.9, lng: 50.68 }, // 이란 람사르
  london: { lat: 51.5, lng: -0.13 }, // 런던
  montreal: { lat: 45.5, lng: -73.57 }, // 몬트리올
  basel: { lat: 47.56, lng: 7.59 }, // 바젤
  unfccc: { lat: -22.9, lng: -43.2 }, // 리우데자네이루
  cbd: { lat: -22.9, lng: -43.2 }, // 리우데자네이루
  unccd: { lat: 48.85, lng: 2.35 }, // 파리(채택)
  kyoto: { lat: 35.0, lng: 135.77 }, // 교토
  paris: { lat: 48.85, lng: 2.35 }, // 파리
}

// 문화권별 중심 지역 (범례 클릭 시 이동)
const REGION_FOCUS: Record<RegionId, { lat: number; lng: number; altitude: number }> = {
  eastasia: { lat: 35, lng: 115, altitude: 1.9 },
  southeastasia: { lat: 5, lng: 112, altitude: 1.9 },
  southasia: { lat: 22, lng: 79, altitude: 1.7 },
  dryislam: { lat: 27, lng: 42, altitude: 2.1 },
  europe: { lat: 50, lng: 15, altitude: 2.0 },
  africa: { lat: -2, lng: 22, altitude: 2.1 },
  angloamerica: { lat: 45, lng: -100, altitude: 2.2 },
  latinamerica: { lat: -15, lng: -60, altitude: 2.1 },
  oceania: { lat: -25, lng: 140, altitude: 2.1 },
}

// 종교별 대표 분포 지역 (범례 클릭 시 이동)
const RELIGION_FOCUS: Record<ReligionId, { lat: number; lng: number; altitude: number }> = {
  catholic: { lat: -12, lng: -58, altitude: 2.3 }, // 라틴 아메리카·남유럽
  protestant: { lat: 52, lng: 4, altitude: 2.1 }, // 북서 유럽·북아메리카
  orthodox: { lat: 54, lng: 40, altitude: 2.1 }, // 동유럽·러시아
  islam: { lat: 25, lng: 45, altitude: 2.0 }, // 서아시아·북아프리카
  hindu: { lat: 22, lng: 79, altitude: 1.6 }, // 인도
  buddhist: { lat: 18, lng: 100, altitude: 1.9 }, // 동남·동아시아
  jewish: { lat: 31.5, lng: 35, altitude: 1.4 }, // 이스라엘
  other: { lat: 35, lng: 105, altitude: 2.0 }, // 동아시아 등
}

export function GlobeView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<GlobeInstance | null>(null)
  const surfaceMatRef = useRef<THREE.MeshBasicMaterial | null>(null) // 지구본 표면 (크림 or 기후 텍스처)
  const climateTexRef = useRef<THREE.Texture | null>(null)
  const [texLoaded, setTexLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)

  // 마운트: 지구본 생성 + 국경 로딩. 한 번만.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    surfaceMatRef.current = new THREE.MeshBasicMaterial({ color: OCEAN })
    // 기후 텍스처를 비동기 로드 (실제 쾨펜 기후 지도)
    new THREE.TextureLoader().load(CLIMATE_TEXTURE_URL, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      climateTexRef.current = tex
      setTexLoaded(true)
    })
    const globe = new Globe(el)
      .backgroundColor(PAPER)
      .showAtmosphere(false)
      .globeMaterial(surfaceMatRef.current) // 표면 재질 (모드에 따라 크림/기후 텍스처 토글)
      // 경위선 (직접 그림)
      .pathsData(GRATICULES)
      .pathPointLat((p) => (p as [number, number])[0])
      .pathPointLng((p) => (p as [number, number])[1])
      .pathColor(() => INK_STROKE_FAINT)
      .pathStroke(0.5)
      .pathTransitionDuration(0)
      // 육지 폴리곤
      .polygonAltitude(0.008)
      .polygonCapColor(() => LAND)
      .polygonSideColor(() => 'rgba(26,46,42,0.12)')
      .polygonStrokeColor(() => INK_STROKE)
      .onPolygonClick((feat: object) => {
        useAppStore.getState().selectCountry(featureToIso(feat))
      })
    globeRef.current = globe

    let cancelled = false
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((geo: { features: object[] }) => {
        if (!cancelled) globe.polygonsData(geo.features)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })

    const onResize = () => {
      globe.width(el.clientWidth).height(el.clientHeight)
    }
    onResize()
    window.addEventListener('resize', onResize)
    // 컨테이너 크기 변화(모드 전환으로 카드가 열리고 닫힐 때)에도 반응 — 캔버스가 카드를 덮지 않도록.
    const ro = new ResizeObserver(onResize)
    ro.observe(el)
    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
      ro.disconnect()
      globe._destructor?.()
      el.innerHTML = ''
      // 표면 재질·텍스처 해제 (StrictMode 이중 마운트 시 GPU 리소스 누수 방지)
      surfaceMatRef.current?.dispose()
      surfaceMatRef.current = null
      climateTexRef.current?.dispose()
      climateTexRef.current = null
    }
  }, [])

  const mode = useAppStore((s) => s.mode)
  const climateFilter = useAppStore((s) => s.climateFilter)
  const activeIssue = useAppStore((s) => s.activeIssue)
  const cultureLayer = useAppStore((s) => s.cultureLayer)
  const religionFilter = useAppStore((s) => s.religionFilter)
  const regionFilter = useAppStore((s) => s.regionFilter)
  const selectedIso = useAppStore((s) => s.selectedIso)
  const selectedFestival = useAppStore((s) => s.selectedFestival)

  // 선택한 대상의 해당 지역으로 지구본을 부드럽게 이동
  const flyTo = (lat: number, lng: number, altitude = 1.9) => {
    globeRef.current?.pointOfView({ lat, lng, altitude }, FLY_MS)
  }

  // 폴리곤 색칠 갱신 (모드별) — 텍스처 없이 단색 면 채우기(choropleth)
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return

    const capColor = (feat: object): string => {
      const iso = featureToIso(feat)
      if (mode === 'climate') {
        // 폴리곤은 투명 — 지구본 표면의 실제 기후 텍스처가 그대로 보이게 (한 나라 안 여러 기후)
        return TRANSPARENT
      }
      if (mode === 'environment') {
        // 협약 선택 시 채택지 국가 강조
        if (selectedIso?.startsWith('treaty:')) {
          const t = TREATY_BY_ID[selectedIso.slice('treaty:'.length) as TreatyId]
          return t && iso === t.host.iso ? VERMILLION : LAND
        }
        if (!activeIssue) return LAND
        const affected = ISSUE_BY_ID[activeIssue].countryIsos.includes(iso ?? '')
        return affected ? VERMILLION : LAND_DIM
      }
      if (mode === 'culture' && cultureLayer === 'religion') {
        const r = getReligion(iso)
        if (!r) return LAND
        if (religionFilter && r !== religionFilter) return LAND_DIM
        return colorForReligion(r)
      }
      if (mode === 'culture' && cultureLayer === 'region') {
        const rg = getRegion(iso)
        if (!rg) return LAND
        if (regionFilter && rg !== regionFilter) return LAND_DIM
        return colorForRegion(rg)
      }
      // culture-festival, quiz: 중립 육지
      return LAND
    }

    // 선택 나라: 빗금 채움 없이 국경선만 진하게 — 짙은 잉크 테두리
    const strokeColor = (feat: object): string => {
      const iso = featureToIso(feat)
      return iso && iso === selectedIso ? '#1a2e2a' : INK_STROKE
    }

    // 선택 나라는 옆면(벽)도 짙게 + 살짝 들어올려 테두리가 도드라지게
    const sideColor = (feat: object): string =>
      featureToIso(feat) === selectedIso ? 'rgba(26,46,42,0.5)' : 'rgba(26,46,42,0.12)'

    globe
      .polygonCapColor(capColor)
      .polygonStrokeColor(strokeColor)
      .polygonSideColor(sideColor)
      .polygonAltitude((feat) => (featureToIso(feat as object) === selectedIso ? 0.02 : 0.008))
  }, [mode, climateFilter, activeIssue, cultureLayer, religionFilter, regionFilter, selectedIso])

  // 지구본 표면: 기후 모드 = 실제 쾨펜 기후 텍스처, 나머지 = 크림 단색.
  // 내 재질의 map을 직접 토글 (globeImageUrl은 재질을 교체해 버려 사용하지 않음)
  useEffect(() => {
    const mat = surfaceMatRef.current
    if (!mat) return
    if (mode === 'climate' && climateTexRef.current) {
      mat.map = climateTexRef.current
      mat.color.set('#ffffff') // 텍스처 원색 그대로
    } else {
      mat.map = null
      mat.color.set(OCEAN)
    }
    mat.needsUpdate = true
  }, [mode, texLoaded])

  // 환경문제 지역 링
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    const rings =
      mode === 'environment' && activeIssue
        ? ISSUE_BY_ID[activeIssue].regions.map((r) => ({ lat: r.lat, lng: r.lng }))
        : []
    globe
      .ringsData(rings)
      .ringColor(() => (t: number) => `rgba(200,69,44,${(1 - t) * 0.9})`)
      .ringMaxRadius(6)
      .ringPropagationSpeed(1.5)
      .ringRepeatPeriod(1300)
  }, [mode, activeIssue])

  // 오버레이 핀 — 기후 모드: 고산 지역 / 문화 모드: 축제
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    type Pin = { id: string; nameKo: string; lat: number; lng: number; kind: 'festival' | 'highland' }
    let pins: Pin[] = []
    if (mode === 'culture' && cultureLayer === 'festival') {
      pins = FESTIVALS.map((f) => ({ id: f.id, nameKo: f.nameKo, lat: f.lat, lng: f.lng, kind: 'festival' }))
    } else if (mode === 'climate') {
      pins = HIGHLANDS.map((h) => ({ id: h.id, nameKo: h.nameKo, lat: h.lat, lng: h.lng, kind: 'highland' }))
    }
    const FEST_ICON =
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4"/><path d="M6 5c3-2 6 2 9 0v7c-3 2-6-2-9 0"/></svg>'
    globe
      .htmlElementsData(pins)
      .htmlLat((d: object) => (d as Pin).lat)
      .htmlLng((d: object) => (d as Pin).lng)
      .htmlAltitude(0.02)
      .htmlElement((d: object) => {
        const pin = d as Pin
        const el = document.createElement('button')
        el.type = 'button'
        if (pin.kind === 'highland') {
          // 고산: 핀이 아니라 검은 빗금 패치로 표시 (범례·카드 스와치와 같은 관례 표기)
          el.className = 'highland-mark'
          el.innerHTML = `<span class="highland-mark__hatch" aria-hidden="true"></span><span class="highland-mark__label">${pin.nameKo}</span>`
          el.onclick = (ev) => {
            ev.stopPropagation()
            useAppStore.getState().selectCountry(`highland:${pin.id}`)
          }
        } else {
          el.className = 'festival-pin'
          el.innerHTML = `<span class="festival-pin__icon">${FEST_ICON}</span><span class="festival-pin__label">${pin.nameKo}</span>`
          el.onclick = (ev) => {
            ev.stopPropagation()
            useAppStore.getState().selectFestival(pin.id)
          }
        }
        return el
      })
  }, [mode, cultureLayer])

  // ── 선택 시 해당 지역으로 지구본 이동 ──
  // 기후 범례(소분류) → 대분류 대표 지역
  useEffect(() => {
    if (climateFilter) {
      const group = SUBTYPE_BY_KO[climateFilter]?.group
      const f = group ? CLIMATE_FOCUS[group] : null
      if (f) flyTo(f.lat, f.lng, f.altitude)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [climateFilter])

  // 환경문제 → 첫 번째 발생·피해 지역
  useEffect(() => {
    if (activeIssue) {
      const r = ISSUE_BY_ID[activeIssue].regions[0]
      if (r) flyTo(r.lat, r.lng, 2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIssue])

  // 협약(연표) → 채택지, 고산 지역 → 해당 고원
  useEffect(() => {
    if (selectedIso?.startsWith('treaty:')) {
      const t = TREATY_FOCUS[selectedIso.slice('treaty:'.length) as TreatyId]
      if (t) flyTo(t.lat, t.lng, 1.9)
    } else if (selectedIso?.startsWith('highland:')) {
      const h = HIGHLAND_BY_ID[selectedIso.slice('highland:'.length)]
      if (h) flyTo(h.lat, h.lng, 1.6)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIso])

  useEffect(() => {
    if (selectedFestival) {
      const f = FESTIVAL_BY_ID[selectedFestival]
      if (f) flyTo(f.lat, f.lng, 1.7)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFestival])

  // 종교(범례) → 해당 종교 대표 분포 지역
  useEffect(() => {
    if (religionFilter) {
      const f = RELIGION_FOCUS[religionFilter]
      if (f) flyTo(f.lat, f.lng, f.altitude)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [religionFilter])

  // 문화권(범례) → 해당 문화권 중심 지역
  useEffect(() => {
    if (regionFilter) {
      const f = REGION_FOCUS[regionFilter]
      if (f) flyTo(f.lat, f.lng, f.altitude)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionFilter])

  return (
    <div className="globe" style={{ position: 'relative' }}>
      <div
        ref={containerRef}
        data-testid="globe"
        role="img"
        aria-label="인터랙티브 3D 지구본. 나라를 클릭해 선택합니다. 키보드나 스크린리더를 쓰면 오른쪽 패널의 검색 상자로 나라를 고를 수 있어요."
        style={{ width: '100%', height: '100%' }}
      />
      {loadError && (
        <div className="globe__error">지구본을 불러오지 못했어요. 페이지를 새로고침 해주세요.</div>
      )}
    </div>
  )
}
