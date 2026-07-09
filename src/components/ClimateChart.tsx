import type { FeaturedClimate } from '../climate/featured'

const MONTHS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

// 잉크/버밀리언/프러시안 팔레트 (App.css 토큰과 일치)
const INK_FAINT = 'rgba(26,46,42,0.22)'
const INK_MUTE = 'rgba(26,46,42,0.55)'
const TEMP = '#c8452c' // 버밀리언 — 기온
const PRECIP = '#2b4c7e' // 프러시안 — 강수

interface ClimateChartProps {
  city: FeaturedClimate
}

/** 기후 그래프(기온·강수량 그래프): 월별 기온(꺾은선) + 강수량(막대). 시험 판독 연습용. */
export function ClimateChart({ city }: ClimateChartProps) {
  const W = 360
  const H = 220
  const M = { top: 22, right: 40, bottom: 28, left: 38 }
  const plotW = W - M.left - M.right
  const plotH = H - M.top - M.bottom

  const tMin = Math.min(0, Math.floor((Math.min(...city.temps) - 4) / 10) * 10)
  const tMax = Math.max(30, Math.ceil((Math.max(...city.temps) + 4) / 10) * 10)
  const pMax = Math.max(100, Math.ceil(Math.max(...city.precip) / 100) * 100)

  const x = (i: number) => M.left + ((i + 0.5) / 12) * plotW
  const yT = (t: number) => M.top + plotH - ((t - tMin) / (tMax - tMin)) * plotH
  const yP = (p: number) => M.top + plotH - (p / pMax) * plotH

  const barW = (plotW / 12) * 0.55
  const line = city.temps.map((t, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${yT(t)}`).join(' ')

  const tTicks: number[] = []
  for (let t = tMin; t <= tMax; t += 10) tTicks.push(t)
  const pTicks = [0, pMax / 2, pMax]

  return (
    <div className="climograph">
      <div className="climograph__head">
        <span className="climograph__city">{city.cityKo}의 기온·강수량</span>
        {city.southern && <span className="climograph__south">남반구 — 1월이 여름</span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${city.cityKo} 기후 그래프`}>
        {tTicks.map((t) => (
          <g key={`t${t}`}>
            <line x1={M.left} x2={W - M.right} y1={yT(t)} y2={yT(t)} stroke={INK_FAINT} strokeWidth="0.5" />
            <text x={M.left - 5} y={yT(t) + 3} textAnchor="end" className="cg-axis">{t}°</text>
          </g>
        ))}
        {pTicks.map((p) => (
          <text key={`p${p}`} x={W - M.right + 5} y={yP(p) + 3} className="cg-axis cg-axis--p">{p}</text>
        ))}
        {tMin < 0 && (
          <line x1={M.left} x2={W - M.right} y1={yT(0)} y2={yT(0)} stroke={INK_MUTE} strokeWidth="0.7" strokeDasharray="3 3" />
        )}
        {city.precip.map((p, i) => (
          <rect key={i} x={x(i) - barW / 2} y={yP(p)} width={barW} height={M.top + plotH - yP(p)} fill={PRECIP} opacity="0.75" />
        ))}
        <path d={line} fill="none" stroke={TEMP} strokeWidth="1.8" strokeLinejoin="round" />
        {city.temps.map((t, i) => (
          <circle key={i} cx={x(i)} cy={yT(t)} r="2" fill={TEMP} />
        ))}
        {MONTHS.map((mo, i) => (
          <text key={mo} x={x(i)} y={H - M.bottom + 14} textAnchor="middle" className="cg-axis">{mo}</text>
        ))}
        <text x={M.left - 5} y={M.top - 9} textAnchor="end" className="cg-label" fill={TEMP}>기온℃</text>
        <text x={W - M.right + 5} y={M.top - 9} className="cg-label" fill={PRECIP}>강수mm</text>
      </svg>
      <details className="climograph__help">
        <summary>이 그래프 읽는 법</summary>
        <ul>
          <li><b style={{ color: TEMP }}>붉은 선</b> = 월평균 기온, <b style={{ color: PRECIP }}>파란 막대</b> = 월강수량</li>
          <li>기온선이 <b>거의 일직선</b>이면 열대(높음)·고산(낮고 온화)</li>
          <li>여름 건조·겨울 강수면 <b>지중해성</b>, 여름에 비가 몰리면 <b>계절풍</b> 지역</li>
          <li>기온선이 <b>1월에 최고(아래로 볼록)</b>면 남반구!</li>
        </ul>
      </details>
    </div>
  )
}
