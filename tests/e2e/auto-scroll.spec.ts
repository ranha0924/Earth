import { test, expect } from '@playwright/test'

// 나라·기후를 누르면 오른쪽 패널을 직접 스크롤하지 않아도
// 해당 상세 카드가 자동으로 보이도록 스크롤된다.
test('기후를 누르면 상세 카드가 패널 안에서 자동으로 보인다', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', '좌·우 패널이 나뉘는 데스크톱 레이아웃 전용')

  // 범례가 패널보다 길도록 낮은 뷰포트 — 카드는 처음엔 접힌(안 보이는) 영역에 생성된다.
  await page.setViewportSize({ width: 1280, height: 520 })
  await page.goto('/')

  const panel = page.locator('.atlas__panel')
  await expect(panel).toBeVisible()
  // 처음엔 패널이 맨 위(스크롤 전) 상태
  expect(await panel.evaluate((el) => el.scrollTop)).toBe(0)

  // 범례 맨 위 기후(열대우림)를 클릭 → 상세 카드는 긴 범례 아래에 생성됨
  await page.getByRole('button', { name: '열대우림' }).click()

  const card = page.getByRole('complementary', { name: /열대우림 기후 정보/ })
  await expect(card).toBeVisible()
  // 자동 스크롤로 카드가 실제 화면(뷰포트) 안으로 들어와야 한다.
  await expect(card).toBeInViewport()
  // 패널이 실제로 아래로 스크롤됐는지 확인 — 자동 스크롤이 일어났다는 증거.
  expect(await panel.evaluate((el) => el.scrollTop)).toBeGreaterThan(0)
})
