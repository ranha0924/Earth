import { useEffect, useRef, useState } from 'react'
import Globe, { type GlobeInstance } from 'globe.gl'
import { useAppStore } from '../store'
import { featureToIso } from './featureIso'
import { climateData, getCountryClimate } from '../climate/data'
import { colorForGroup } from '../climate/types'
import { getReligion } from '../culture/data'
import { colorForReligion } from '../culture/types'
import { ISSUE_BY_ID } from '../environment/data'
import { FESTIVALS } from '../culture/festivals'

const TEXTURE_URL = `${import.meta.env.BASE_URL}textures/koppen.png`
const GEOJSON_URL = `${import.meta.env.BASE_URL}data/countries.geojson`

const TRANSPARENT = 'rgba(0,0,0,0)'
const NEUTRAL = 'rgba(30,44,68,0.82)'
const DIM = 'rgba(24,34,52,0.7)'

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
    return () => {
      cancelled = true
      window.removeEventListener('resize', onResize)
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

  return (
    <div className="globe" style={{ position: 'relative' }}>
      <div ref={containerRef} data-testid="globe" style={{ width: '100%', height: '100%' }} />
      {loadError && (
        <div className="globe__error">지구본을 불러오지 못했어요. 페이지를 새로고침 해주세요.</div>
      )}
    </div>
  )
}
