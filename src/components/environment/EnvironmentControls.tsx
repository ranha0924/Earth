import { useAppStore } from '../../store'
import { ISSUES, TREATIES } from '../../environment/data'
import { Icon } from '../Icon'

/** 환경 모드 하단 컨트롤 — 탭(환경문제/국제협약) + 문제 칩 또는 협약 연표 */
export function EnvironmentControls() {
  const tab = useAppStore((s) => s.environmentTab)
  const setTab = useAppStore((s) => s.setEnvironmentTab)
  const activeIssue = useAppStore((s) => s.activeIssue)
  const setActiveIssue = useAppStore((s) => s.setActiveIssue)
  const selectedIso = useAppStore((s) => s.selectedIso)
  const select = useAppStore((s) => s.selectCountry)

  return (
    <div className="env-controls">
      <div className="env-tabs" role="tablist" aria-label="환경 모드 탭">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'issues'}
          className={`env-tab${tab === 'issues' ? ' env-tab--active' : ''}`}
          onClick={() => setTab('issues')}
        >
          <Icon name="warning" size={14} /> 환경문제
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'treaties'}
          className={`env-tab${tab === 'treaties' ? ' env-tab--active' : ''}`}
          onClick={() => setTab('treaties')}
        >
          <Icon name="treaty" size={14} /> 국제협약
        </button>
      </div>

      {tab === 'issues' ? (
        <div className="env-chip-row">
          {ISSUES.map((issue) => (
            <button
              key={issue.id}
              type="button"
              className={`env-chip${activeIssue === issue.id ? ' env-chip--active' : ''}`}
              aria-pressed={activeIssue === issue.id}
              onClick={() => {
                setActiveIssue(issue.id)
                select(null)
              }}
            >
              <Icon name={issue.id} size={16} /> {issue.nameKo}
            </button>
          ))}
        </div>
      ) : (
        <div className="treaty-timeline" role="list" aria-label="국제협약 연표">
          {TREATIES.map((t) => (
            <button
              key={t.id}
              type="button"
              role="listitem"
              className={`treaty-node${selectedIso === `treaty:${t.id}` ? ' treaty-node--active' : ''}${
                t.lineage === 'climate' ? ' treaty-node--climate' : ''
              }`}
              onClick={() => select(`treaty:${t.id}`)}
            >
              <span className="stamp">Fig. {t.year}</span>
              <span className="treaty-node__name">{t.nameKo}</span>
            </button>
          ))}
        </div>
      )}
      {tab === 'treaties' && (
        <p className="treaty-lineage-hint">
          <b>붉은 점</b> = 기후변화협약(1992) → 교토(1997) → 파리(2015) 계보 (최다 출제)
        </p>
      )}
    </div>
  )
}
