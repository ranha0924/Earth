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
    const globe = new Globe(el)
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

    let cancelled = false
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((geo: { features: object[] }) => {
        if (!cancelled) globe.polygonsData(geo.features)
      })
      .catch(() => {
        if (!cancelled) el.setAttribute('data-globe-error', 'true')
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
