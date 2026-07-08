export type QuizCategory = 'climate' | 'environment' | 'treaty' | 'culture' | 'map'

export interface ChoiceQuestion {
  id: string
  category: Exclude<QuizCategory, 'map'>
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

export type QuizQuestion = ChoiceQuestion | MapQuestion

export function isMapQuestion(q: QuizQuestion): q is MapQuestion {
  return q.category === 'map'
}

export const CATEGORY_LABEL: Record<QuizCategory, string> = {
  climate: '기후',
  environment: '환경문제',
  treaty: '국제협약',
  culture: '문화',
  map: '지도 찾기',
}
