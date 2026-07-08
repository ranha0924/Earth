import { useEffect, useRef, useState } from 'react'
import Globe, { type GlobeInstance } from 'globe.gl'
import { useAppStore } from '../store'
import { featureToIso } from './featureIso'
import { climateData, getCountryClimate } from '../climate/data'
import { colorForGroup, type ClimateGroup } from '../climate/types'
import { getReligion } from '../culture/data'
import { colorForReligion } from '../culture/types'
import { ISSUE_BY_ID } from '../environment/data'
import { FESTIVALS, FESTIVAL_BY_ID } from '../culture/festivals'
import type { TreatyId } from '../environment/types'

const TEXTURE_URL = `${import.meta.env.BASE_URL}textures/koppen.png`
const GEOJSON_URL = `${import.meta.env.BASE_URL}data/countries.geojson`

const TRANSPARENT = 'rgba(0,0,0,0)'
const NEUTRAL = 'rgba(30,44,68,0.82)'
const DIM = 'rgba(24,34,52,0.7)'

const FLY_MS = 900

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
  const [loadError, setLoadError] = useState(false)

  // 마운트: 지구본 생성 + 국경 로딩. 한 번만.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const globe = new Globe(el)
      .globeImageUrl(TEXTURE_URL)
      .backgroundColor('#0b1a2b')
      .polygonAltitude(0.006)
      .polygonCapColor(() => TRANSPARENT)
      .polygonSideColor(() => 'rgba(0,0,0,0)')
      .polygonStrokeColor(() => 'rgba(255,255,255,0.15)')
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

  // 폴리곤 색칠 갱신 (모드별)
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return

    const capColor = (feat: object): string => {
      const iso = featureToIso(feat)
      if (mode === 'climate') {
        if (!climateFilter) return TRANSPARENT
        const c = getCountryClimate(climateData, iso)
        return c?.group === climateFilter ? `${colorForGroup(climateFilter)}cc` : TRANSPARENT
      }
      if (mode === 'environment') {
        if (!activeIssue) return NEUTRAL
        const affected = ISSUE_BY_ID[activeIssue].countryIsos.includes(iso ?? '')
        return affected ? 'rgba(248,113,113,0.9)' : DIM
      }
      if (mode === 'culture' && cultureLayer === 'religion') {
        const r = getReligion(iso)
        if (!r) return NEUTRAL
        if (religionFilter && r !== religionFilter) return DIM
        return `${colorForReligion(r)}e6`
      }
      // culture-festival, quiz: 중립 채움
      return NEUTRAL
    }

    const strokeColor = (feat: object): string => {
      const iso = featureToIso(feat)
      if (iso && iso === selectedIso) return '#ffffff'
      if (mode === 'climate') {
        if (!climateFilter) return 'rgba(255,255,255,0.15)'
        const c = getCountryClimate(climateData, iso)
        return c?.group === climateFilter ? '#ffffff' : 'rgba(255,255,255,0.05)'
      }
      return 'rgba(255,255,255,0.18)'
    }

    globe.polygonCapColor(capColor).polygonStrokeColor(strokeColor)
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
      .ringColor(() => (t: number) => `rgba(248,113,113,${Math.sqrt(1 - t)})`)
      .ringMaxRadius(6)
      .ringPropagationSpeed(1.6)
      .ringRepeatPeriod(1100)
  }, [mode, activeIssue])

  // 문화 모드 축제 핀
  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    const show = mode === 'culture' && cultureLayer === 'festival'
    globe
      .htmlElementsData(show ? FESTIVALS : [])
      .htmlLat((d: object) => (d as (typeof FESTIVALS)[number]).lat)
      .htmlLng((d: object) => (d as (typeof FESTIVALS)[number]).lng)
      .htmlAltitude(0.02)
      .htmlElement((d: object) => {
        const f = d as (typeof FESTIVALS)[number]
        const el = document.createElement('button')
        el.className = 'festival-pin'
        el.type = 'button'
        el.innerHTML = `<span class="festival-pin__icon">🎉</span><span class="festival-pin__label">${f.nameKo}</span>`
        el.onclick = (ev) => {
          ev.stopPropagation()
          useAppStore.getState().selectFestival(f.id)
        }
        return el
      })
  }, [mode, cultureLayer])

  // ── 선택 시 해당 지역으로 지구본 이동 ──
  // 기후 범례 → 대표 지역
  useEffect(() => {
    if (climateFilter) {
      const f = CLIMATE_FOCUS[climateFilter]
      flyTo(f.lat, f.lng, f.altitude)
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

  // 협약(연표) → 채택지, 축제 → 개최지
  useEffect(() => {
    if (selectedIso?.startsWith('treaty:')) {
      const t = TREATY_FOCUS[selectedIso.slice('treaty:'.length) as TreatyId]
      if (t) flyTo(t.lat, t.lng, 1.9)
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
