import type { Ref } from 'react'
import { useAppStore } from '../../store'
import { ISSUE_BY_ID, TREATY_BY_ID, ISSUES, TREATIES } from '../../environment/data'
import { countryNameKo } from '../../data/countryNames'
import { Icon } from '../Icon'
import { useScrollIntoView } from '../../hooks/useScrollIntoView'
import type { IssueId, TreatyId } from '../../environment/types'

export function EnvironmentCard() {
  const tab = useAppStore((s) => s.environmentTab)
  const activeIssue = useAppStore((s) => s.activeIssue)
  const selectedIso = useAppStore((s) => s.selectedIso)
  const select = useAppStore((s) => s.selectCountry)
  const setActiveIssue = useAppStore((s) => s.setActiveIssue)
  // 나라·환경문제·협약 중 무엇을 눌러도 그 상세 카드가 패널 안에서 보이도록 스크롤
  const cardRef = useScrollIntoView<HTMLElement>(selectedIso ?? activeIssue)

  // 협약 노드 선택
  if (selectedIso?.startsWith('treaty:')) {
    const tid = selectedIso.slice('treaty:'.length) as TreatyId
    return <TreatyDetail id={tid} onClose={() => select(null)} cardRef={cardRef} />
  }

  // 나라 선택 (환경문제 탭에서) → 관련 환경문제
  if (tab === 'issues' && selectedIso && !selectedIso.startsWith('treaty:')) {
    return (
      <CountryEnvironment
        iso={selectedIso}
        onClose={() => select(null)}
        onIssue={(id) => {
          setActiveIssue(id)
          select(null)
        }}
        cardRef={cardRef}
      />
    )
  }

  if (tab === 'issues' && activeIssue) {
    return (
      <IssueDetail
        id={activeIssue}
        onClose={() => setActiveIssue(null)}
        onTreatyJump={(tid) => {
          useAppStore.getState().setEnvironmentTab('treaties')
          select(`treaty:${tid}`)
        }}
        cardRef={cardRef}
      />
    )
  }

  // 나라 선택 (협약 탭에서) → 그 나라에서 채택된 협약
  if (tab === 'treaties' && selectedIso && !selectedIso.startsWith('treaty:')) {
    return (
      <CountryTreaties
        iso={selectedIso}
        onClose={() => select(null)}
        onTreaty={(tid) => select(`treaty:${tid}`)}
        cardRef={cardRef}
      />
    )
  }

  // 안내
  return (
    <aside className="card" aria-label="환경 정보">
      {tab === 'issues' ? (
        <p className="card__empty">
          아래에서 <b>환경문제</b>를 골라 보세요. 지구본에 발생·피해 지역이 표시되고, 원인부터
          대책까지 정리됩니다. 나라를 누르면 그 나라와 관련된 환경문제를 볼 수 있어요.
        </p>
      ) : (
        <p className="card__empty">
          아래 <b>연표</b>에서 협약을 골라 보세요. 연도·대상·핵심 내용과 헷갈리기 쉬운 포인트를
          정리했습니다. <b>나라</b>를 누르면 그 나라에서 채택된 협약을 볼 수 있어요.
        </p>
      )}
    </aside>
  )
}

function IssueDetail({
  id,
  onClose,
  onTreatyJump,
  cardRef,
}: {
  id: IssueId
  onClose: () => void
  onTreatyJump: (id: TreatyId) => void
  cardRef: Ref<HTMLElement>
}) {
  const issue = ISSUE_BY_ID[id]
  return (
    <aside ref={cardRef} className="card" aria-label={`${issue.nameKo} 정보`}>
      <button type="button" className="card__close" onClick={onClose}>
        닫기 <Icon name="close" size={12} />
      </button>
      <h2 className="card__title">
        <Icon name={issue.id} size={20} /> {issue.nameKo}
      </h2>
      <p className="cross-border">
        <Icon name="globe" size={15} /> 국경을 넘는 전 지구적 문제 — 국제 협력이 필요합니다.
      </p>
      <Section title="원인" text={issue.cause} />
      <Section title="현상" text={issue.phenomenon} />
      <Section title="영향" text={issue.effect} />
      <Section title="대책" text={issue.solution} />
      <div className="card__section">
        <h3 className="card__h3">관련 국제 협약</h3>
        {issue.treaties.length > 0 ? (
          <div className="badge-row">
            {issue.treaties.map((tid) => (
              <button key={tid} type="button" className="treaty-badge" onClick={() => onTreatyJump(tid)}>
                <Icon name="treaty" size={13} /> {TREATY_BY_ID[tid].nameKo} · Fig. {TREATY_BY_ID[tid].year}
              </button>
            ))}
          </div>
        ) : (
          <p className="no-treaty">
            직접 대응하는 국제 협약은 시험 범위에 없습니다. 국가 간 협력으로 함께 해결해야 하는
            문제예요.
          </p>
        )}
      </div>
      <div className="card__section">
        <h3 className="card__h3">주요 발생·피해 지역</h3>
        <div className="badge-row">
          {issue.regions.map((r) => (
            <span key={r.nameKo} className="region-badge">
              <Icon name="location" size={12} /> {r.nameKo}
            </span>
          ))}
        </div>
      </div>
    </aside>
  )
}

function TreatyDetail({ id, onClose, cardRef }: { id: TreatyId; onClose: () => void; cardRef: Ref<HTMLElement> }) {
  const t = TREATY_BY_ID[id]
  return (
    <aside ref={cardRef} className="card" aria-label={`${t.nameKo} 정보`}>
      <button type="button" className="card__close" onClick={onClose}>
        닫기 <Icon name="close" size={12} />
      </button>
      <h2 className="card__title">
        <Icon name="treaty" size={19} /> {t.nameKo}
        <span className="stamp">Fig. {t.year}</span>
      </h2>
      <div className="card__row">
        <span className="treaty-target">대상: {t.target}</span>
      </div>
      <div className="card__row">
        <span className="treaty-target">
          <Icon name="location" size={12} /> 채택지: {t.host.placeKo} — 지구본에 붉게 표시돼요
        </span>
      </div>
      <Section title="핵심 내용" text={t.summary} />
      {t.confusion && (
        <div className="confusion">
          <b><Icon name="warning" size={13} /> 헷갈리기 쉬운 포인트</b>
          <p>{t.confusion}</p>
        </div>
      )}
      {t.lineage === 'climate' && (
        <p className="lineage-note">
          기후 변화 대응 계보: <b>기후변화협약(1992) → 교토 의정서(1997) → 파리 협정(2015)</b>
        </p>
      )}
    </aside>
  )
}

function CountryEnvironment({
  iso,
  onClose,
  onIssue,
  cardRef,
}: {
  iso: string
  onClose: () => void
  onIssue: (id: IssueId) => void
  cardRef: Ref<HTMLElement>
}) {
  const related = ISSUES.filter((i) => i.countryIsos.includes(iso))
  return (
    <aside ref={cardRef} className="card" aria-label="나라별 환경문제">
      <button type="button" className="card__close" onClick={onClose}>
        닫기 <Icon name="close" size={12} />
      </button>
      <h2 className="card__title">{countryNameKo(iso)}<span className="card__title-en">관련 환경문제</span></h2>
      {related.length > 0 ? (
        <div className="issue-link-list">
          {related.map((i) => (
            <button key={i.id} type="button" className="issue-link" onClick={() => onIssue(i.id)}>
              <span className="issue-link__icon"><Icon name={i.id} size={20} /></span>
              <span>
                <b>{i.nameKo}</b>
                <br />
                <small>{i.phenomenon}</small>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="card__empty">
          이 나라와 교과서에서 특별히 연결하는 환경문제는 정리되어 있지 않아요. 아래 문제 칩을 눌러
          각 환경문제의 발생 지역을 지구본에서 확인해 보세요.
        </p>
      )}
    </aside>
  )
}

function CountryTreaties({
  iso,
  onClose,
  onTreaty,
  cardRef,
}: {
  iso: string
  onClose: () => void
  onTreaty: (id: TreatyId) => void
  cardRef: Ref<HTMLElement>
}) {
  const adopted = TREATIES.filter((t) => t.host.iso === iso)
  return (
    <aside ref={cardRef} className="card" aria-label="나라별 채택 협약">
      <button type="button" className="card__close" onClick={onClose}>
        닫기 <Icon name="close" size={12} />
      </button>
      <h2 className="card__title">
        {countryNameKo(iso)}
        <span className="card__title-en">채택한 국제 협약</span>
      </h2>
      {adopted.length > 0 ? (
        <>
          <p className="cross-border">
            <Icon name="location" size={15} /> 이 나라에서 채택된 협약이에요. 협약을 누르면 자세히 볼 수 있어요.
          </p>
          <div className="issue-link-list">
            {adopted.map((t) => (
              <button key={t.id} type="button" className="issue-link" onClick={() => onTreaty(t.id)}>
                <span className="issue-link__icon">
                  <Icon name="treaty" size={20} />
                </span>
                <span>
                  <b>{t.nameKo}</b> · Fig. {t.year}
                  <br />
                  <small>{t.host.placeKo} · {t.target}</small>
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="card__empty">
          이 나라에서 채택된 협약은 없어요. 몬트리올 의정서·기후 변화 협약·파리 협정 등 주요 협약은
          대부분의 나라가 가입해 있지만, 시험에는 <b>어디에서 채택됐는지(채택지)</b>가 자주 나와요.
          아래 연표에서 협약을 눌러 채택지를 확인해 보세요.
        </p>
      )}
    </aside>
  )
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <div className="card__section">
      <h3 className="card__h3">{title}</h3>
      <p className="card__note">{text}</p>
    </div>
  )
}
