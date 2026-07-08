import { useMemo, useState } from 'react'
import { TREATIES } from '../../environment/data'
import type { TreatyId } from '../../environment/types'
import { Icon } from '../Icon'

// 결정적 셔플 (Math.random 없이도 되지만 게임이라 재시작마다 섞이도록 seed 사용)
function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

interface MatchingGameProps {
  onClose: () => void
}

/** 협약 ↔ 핵심 키워드 짝 맞추기 */
export function MatchingGame({ onClose }: MatchingGameProps) {
  const [round, setRound] = useState(1)
  const [picked, setPicked] = useState<TreatyId | null>(null)
  const [matched, setMatched] = useState<Set<TreatyId>>(new Set())
  const [wrong, setWrong] = useState<TreatyId | null>(null)

  const leftOrder = useMemo(() => shuffle(TREATIES.map((t) => t.id), round * 7 + 3), [round])
  const rightOrder = useMemo(() => shuffle(TREATIES.map((t) => t.id), round * 13 + 5), [round])

  const done = matched.size === TREATIES.length

  const onLeft = (id: TreatyId) => {
    if (matched.has(id)) return
    setPicked(id)
    setWrong(null)
  }
  const onRight = (id: TreatyId) => {
    if (matched.has(id) || !picked) return
    if (picked === id) {
      const next = new Set(matched)
      next.add(id)
      setMatched(next)
      setPicked(null)
    } else {
      setWrong(id)
      setTimeout(() => setWrong(null), 500)
    }
  }

  const restart = () => {
    setMatched(new Set())
    setPicked(null)
    setWrong(null)
    setRound((r) => r + 1)
  }

  return (
    <div className="matching-overlay" role="dialog" aria-label="협약 매칭 게임">
      <div className="matching">
        <div className="matching__head">
          <h2>협약 · 키워드 매칭</h2>
          <button type="button" className="card__close" onClick={onClose}>
            닫기 <Icon name="close" size={12} />
          </button>
        </div>
        <p className="matching__hint">
          왼쪽 협약을 누르고, 오른쪽에서 알맞은 대상·키워드를 누르세요. ({matched.size}/
          {TREATIES.length})
        </p>
        {done ? (
          <div className="matching__done">
            <p>모두 맞혔어요! 9개 협약을 완벽하게 정리했네요.</p>
            <button type="button" className="matching__restart" onClick={restart}>
              다시 섞어서 도전
            </button>
          </div>
        ) : (
          <div className="matching__cols">
            <div className="matching__col">
              {leftOrder.map((id) => {
                const t = TREATIES.find((x) => x.id === id)!
                return (
                  <button
                    key={id}
                    type="button"
                    className={`match-item${matched.has(id) ? ' match-item--done' : ''}${
                      picked === id ? ' match-item--picked' : ''
                    }`}
                    disabled={matched.has(id)}
                    onClick={() => onLeft(id)}
                  >
                    {t.nameKo}
                    <small>Fig. {t.year}</small>
                  </button>
                )
              })}
            </div>
            <div className="matching__col">
              {rightOrder.map((id) => {
                const t = TREATIES.find((x) => x.id === id)!
                return (
                  <button
                    key={id}
                    type="button"
                    className={`match-item match-item--key${
                      matched.has(id) ? ' match-item--done' : ''
                    }${wrong === id ? ' match-item--wrong' : ''}`}
                    disabled={matched.has(id)}
                    onClick={() => onRight(id)}
                  >
                    {t.keyword}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
