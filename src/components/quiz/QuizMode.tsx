import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '../../store'
import { QUIZ_BANK } from '../../quiz/data'
import { CATEGORY_LABEL, isMapQuestion, type QuizQuestion } from '../../quiz/types'
import { loadRecord, saveResult, type QuizRecord } from '../../quiz/storage'
import { countryNameKo } from '../../data/countryNames'

const SET_SIZE = 10

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickSet(): QuizQuestion[] {
  // 카테고리가 골고루 섞이도록 전체 셔플 후 앞에서 SET_SIZE개
  return shuffle(QUIZ_BANK).slice(0, SET_SIZE)
}

interface Answered {
  correct: boolean
  picked: string // 선택한 보기 텍스트 또는 클릭한 국가명
}

export function QuizMode() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => pickSet())
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState<Answered | null>(null)
  const [score, setScore] = useState(0)
  const [wrongIds, setWrongIds] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const [record, setRecord] = useState<QuizRecord>(() => loadRecord())

  const selectedIso = useAppStore((s) => s.selectedIso)
  const select = useAppStore((s) => s.selectCountry)
  const setMode = useAppStore((s) => s.setMode)
  const prevIso = useRef<string | null>(selectedIso)

  const current = questions[index]

  // 지도 문제: 지구본 클릭(selectedIso 변화)을 정답 판정에 사용
  useEffect(() => {
    if (!current || finished || answered) {
      prevIso.current = selectedIso
      return
    }
    if (isMapQuestion(current) && selectedIso && selectedIso !== prevIso.current) {
      const correct = current.answerIsos.includes(selectedIso)
      commit(correct, countryNameKo(selectedIso))
    }
    prevIso.current = selectedIso
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIso])

  function commit(correct: boolean, picked: string) {
    setAnswered({ correct, picked })
    if (correct) setScore((s) => s + 1)
    else setWrongIds((w) => [...w, current.id])
  }

  function onChoice(choiceIdx: number) {
    if (answered || isMapQuestion(current)) return
    const correct = choiceIdx === current.answerIndex
    commit(correct, current.choices[choiceIdx])
  }

  function next() {
    select(null)
    if (index + 1 >= questions.length) {
      const rec = saveResult(score, wrongIds)
      setRecord(rec)
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
      setAnswered(null)
    }
  }

  function restart() {
    select(null)
    setQuestions(pickSet())
    setIndex(0)
    setAnswered(null)
    setScore(0)
    setWrongIds([])
    setFinished(false)
  }

  const wrongReview = useMemo(
    () => QUIZ_BANK.filter((q) => record.wrongIds.includes(q.id)),
    [record.wrongIds],
  )

  if (finished) {
    return (
      <aside className="card quiz-card" aria-label="퀴즈 결과">
        <h2 className="card__title">🏁 퀴즈 결과</h2>
        <p className="quiz-score">
          {SET_SIZE}문제 중 <b>{score}</b>개 정답!
        </p>
        <p className="card__note">
          최고 점수 {record.bestScore} · 지금까지 {record.playCount}판 풀었어요.
        </p>
        <button type="button" className="quiz-primary" onClick={restart}>
          다시 풀기
        </button>
        {wrongReview.length > 0 && (
          <div className="card__section">
            <h3 className="card__h3">📌 오답 노트 (누적)</h3>
            <div className="wrong-note-list">
              {wrongReview.map((q) => (
                <div key={q.id} className="wrong-note">
                  <span className="wrong-note__cat">{CATEGORY_LABEL[q.category]}</span>
                  <p className="wrong-note__q">{q.question}</p>
                  <p className="wrong-note__a">
                    ✅{' '}
                    {isMapQuestion(q)
                      ? q.answerIsos.map(countryNameKo).join(', ')
                      : q.choices[q.answerIndex]}
                  </p>
                  <p className="wrong-note__e">{q.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    )
  }

  return (
    <aside className="card quiz-card" aria-label="퀴즈">
      <div className="quiz-top">
        <span className="quiz-progress">
          {index + 1} / {questions.length}
        </span>
        <span className="quiz-cat">{CATEGORY_LABEL[current.category]}</span>
        <span className="quiz-live-score">점수 {score}</span>
      </div>

      <p className="quiz-question">{current.question}</p>

      {isMapQuestion(current) ? (
        <div className="quiz-map-hint">
          🌐 지구본을 돌려 알맞은 나라를 <b>직접 클릭</b>하세요.
          {answered && (
            <p className={`quiz-map-result ${answered.correct ? 'ok' : 'no'}`}>
              {answered.correct ? '⭕ 정답' : '❌ 오답'} — {answered.picked}을(를) 선택했어요.
            </p>
          )}
        </div>
      ) : (
        <div className="quiz-choices">
          {current.choices.map((c, i) => {
            const isAnswer = i === current.answerIndex
            const isPicked = answered?.picked === c
            let cls = 'quiz-choice'
            if (answered) {
              if (isAnswer) cls += ' quiz-choice--correct'
              else if (isPicked) cls += ' quiz-choice--wrong'
            }
            return (
              <button
                key={i}
                type="button"
                className={cls}
                disabled={!!answered}
                onClick={() => onChoice(i)}
              >
                {c}
              </button>
            )
          })}
        </div>
      )}

      {answered && (
        <div className={`quiz-explain ${answered.correct ? 'ok' : 'no'}`}>
          <b>{answered.correct ? '⭕ 정답이에요!' : '❌ 아쉬워요'}</b>
          <p>{current.explanation}</p>
        </div>
      )}

      <div className="quiz-actions">
        {answered ? (
          <button type="button" className="quiz-primary" onClick={next}>
            {index + 1 >= questions.length ? '결과 보기' : '다음 문제 →'}
          </button>
        ) : (
          isMapQuestion(current) && (
            <button type="button" className="quiz-skip" onClick={() => commit(false, '건너뜀')}>
              모르겠어요 (건너뛰기)
            </button>
          )
        )}
        <button type="button" className="quiz-quit" onClick={() => setMode('climate')}>
          그만두기
        </button>
      </div>
    </aside>
  )
}
