import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import Globe, { type GlobeInstance } from 'globe.gl'
import { useAppStore } from '../store'
import { featureToIso } from './featureIso'
import { climateData, getCountryClimate } from '../climate/data'
import type { ClimateGroup } from '../climate/types'
import { SUBTYPE_BY_KO, colorForSubtypeKo } from '../climate/subtypes'
import { getReligion } from '../culture/data'
import { colorForReligion } from '../culture/types'
import { ISSUE_BY_ID, TREATY_BY_ID } from '../environment/data'
import { FESTIVALS, FESTIVAL_BY_ID } from '../culture/festivals'
import { HIGHLANDS, HIGHLAND_BY_ID } from '../climate/highlands'
import type { TreatyId } from '../environment/types'

const GEOJSON_URL = `${import.meta.env.BASE_URL}data/countries.geojson`

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

// 사선 해칭 텍스처 재료 (크림 바탕 + 지정색 대각선)
function makeHatchMaterial(lineColor: string, lineWidth = 3): THREE.Material {
  const s = 24
  const cvs = document.createElement('canvas')
  cvs.width = cvs.height = s
  const ctx = cvs.getContext('2d')!
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, s, s)
  ctx.strokeStyle = lineColor
  ctx.lineWidth = lineWidth
  ctx.lineCap = 'round'
  for (let o = -s; o < s * 2; o += 8) {
    ctx.beginPath()
    ctx.moveTo(o, 0)
    ctx.lineTo(o + s, s)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(cvs)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(16, 16)
  return new THREE.MeshBasicMaterial({ map: tex })
}

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

export function GlobeView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<GlobeInstance | null>(null)
  const hatchRef = useRef<THREE.Material | null>(null) // 선택 지역 (버밀리언)
  const highlandHatchRef = useRef<THREE.Material | null>(null) // 고산 기후 (플럼)
  const [loadError, setLoadError] = useState(false)

  // 마운트: 지구본 생성 + 국경 로딩. 한 번만.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    hatchRef.current = makeHatchMaterial(VERMILLION, 3)
    highlandHatchRef.current = makeHatchMaterial('#3d3d3d', 2.8) // 교과서식 검은 사선(고산)
    const globe = new Globe(el)
      .backgroundColor(PAPER)
      .showAtmosphere(false)
      .globeMaterial(new THREE.MeshBasicMaterial({ color: OCEAN })) // 크림 바다, 텍스처 없음
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
      // 해칭 material/텍스처 해제 (StrictMode 이중 마운트 시 GPU 리소스 누수 방지)
      for (const ref of [hatchRef, highlandHatchRef]) {
        const m = ref.current as THREE.MeshBasicMaterial | null
        m?.map?.dispose()
        m?.dispose()
        ref.current = null
      }
    }
  }, [])

  const mode = useAppStore((s) => s.mode)
  const climateFilter = useAppStore((s) => s.climateFilter)
  const activeIssue = useAppStore((s) => s.activeIssue)
  const cultureLayer = useAppStore((s) => s.cultureLayer)
  const religionFilter = useAppStore((s) => s.religionFilter)
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
        // 나라별 대표 기후 소분류로 색칠 (통합사회 팔레트)
        const c = getCountryClimate(climateData, iso)
        if (!c) return LAND
        if (climateFilter && c.subtype !== climateFilter) return LAND_DIM
        if (SUBTYPE_BY_KO[c.subtype]?.hatch) return PAPER // 고산: 해칭 재료 바탕
        return colorForSubtypeKo(c.subtype) ?? LAND
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
      // culture-festival, quiz: 중립 육지
      return LAND
    }

    // 사선 해칭 material: 선택 지역(버밀리언) 우선, 기후 모드의 고산(플럼) 그다음
    const capMaterial = (feat: object): THREE.Material | undefined => {
      const iso = featureToIso(feat)
      if (iso && iso === selectedIso && hatchRef.current) return hatchRef.current
      if (mode === 'climate') {
        const c = getCountryClimate(climateData, iso)
        if (c && SUBTYPE_BY_KO[c.subtype]?.hatch && highlandHatchRef.current) {
          if (climateFilter && c.subtype !== climateFilter) return undefined // 흐림 처리 시 해칭 생략
          return highlandHatchRef.current
        }
      }
      return undefined
    }

    const strokeColor = (feat: object): string => {
      const iso = featureToIso(feat)
      return iso && iso === selectedIso ? '#1a2e2a' : INK_STROKE
    }

    globe
      .polygonCapColor(capColor)
      .polygonCapMaterial(capMaterial as (d: object) => THREE.Material)
      .polygonStrokeColor(strokeColor)
      .polygonAltitude((feat) => (featureToIso(feat as object) === selectedIso ? 0.018 : 0.008))
  }, [mode, climateFilter, activeIssue, cultureLayer, religionFilter, selectedIso])

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
    const PEAK_ICON =
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18L14 6l-3.5 6.5L8 9z"/></svg>'
    globe
      .htmlElementsData(pins)
      .htmlLat((d: object) => (d as Pin).lat)
      .htmlLng((d: object) => (d as Pin).lng)
      .htmlAltitude(0.02)
      .htmlElement((d: object) => {
        const pin = d as Pin
        const el = document.createElement('button')
        el.className = `festival-pin${pin.kind === 'highland' ? ' highland-pin' : ''}`
        el.type = 'button'
        el.innerHTML = `<span class="festival-pin__icon">${pin.kind === 'highland' ? PEAK_ICON : FEST_ICON}</span><span class="festival-pin__label">${pin.nameKo}</span>`
        el.onclick = (ev) => {
          ev.stopPropagation()
          if (pin.kind === 'festival') useAppStore.getState().selectFestival(pin.id)
          else useAppStore.getState().selectCountry(`highland:${pin.id}`)
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

  return (
    <div className="globe" style={{ position: 'relative' }}>
      <div ref={containerRef} data-testid="globe" style={{ width: '100%', height: '100%' }} />
      {loadError && (
        <div className="globe__error">지구본을 불러오지 못했어요. 페이지를 새로고침 해주세요.</div>
      )}
    </div>
  )
}
