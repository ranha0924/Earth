export type QuizCategory = 'climate' | 'environment' | 'treaty' | 'culture' | 'map' | 'graph'

export interface ChoiceQuestion {
  id: string
  category: Exclude<QuizCategory, 'map' | 'graph'>
  question: string
  choices: string[]
  answerIndex: number
  explanation: string
}

export interface MapQuestion {
  id: string
  category: 'map'
  question: string
  answerIsos: string[] // 정답 국가 ISO_A2 (복수 정답)
  explanation: string
}

export interface GraphQuestion {
  id: string
  category: 'graph'
  question: string
  graphIso: string // 기후 그래프를 보여줄 국가 ISO_A2 (featured 데이터 필요)
  choices: string[]
  answerIndex: number
  explanation: string
}

export type QuizQuestion = ChoiceQuestion | MapQuestion | GraphQuestion

export function isMapQuestion(q: QuizQuestion): q is MapQuestion {
  return q.category === 'map'
}

export function isGraphQuestion(q: QuizQuestion): q is GraphQuestion {
  return q.category === 'graph'
}

export const CATEGORY_LABEL: Record<QuizCategory, string> = {
  climate: '기후',
  environment: '환경문제',
  treaty: '국제협약',
  culture: '문화',
  map: '지도 찾기',
  graph: '그래프 판독',
}
