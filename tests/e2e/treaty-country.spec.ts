import { test, expect } from '@playwright/test'

// 협약 탭에서 나라를 고르면 그 나라에서 '채택된' 협약(host)이 나온다.
test('협약 탭 — 채택지 나라를 고르면 그 나라에서 채택된 협약이 나온다', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '환경' }).click()
  await page.getByRole('tab', { name: '국제협약' }).click()

  // 키보드 검색으로 채택지 국가(일본 = 교토 의정서) 선택
  const search = page.getByRole('combobox', { name: '나라 검색' })
  await search.focus()
  await search.pressSequentially('일본')

  const card = page.getByRole('complementary', { name: '나라별 채택 협약' })
  await expect(card).toBeVisible()
  await expect(card.getByText('교토 의정서')).toBeVisible()

  // 협약을 누르면 상세로 이동한다
  await card.getByText('교토 의정서').click()
  await expect(page.getByRole('complementary', { name: /교토 의정서 정보/ })).toBeVisible()
})

// 채택지가 아닌 나라는 "채택된 협약 없음" 안내를 보여준다(정확성).
test('협약 탭 — 채택지가 아닌 나라는 채택 협약 없음 안내', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '환경' }).click()
  await page.getByRole('tab', { name: '국제협약' }).click()

  const search = page.getByRole('combobox', { name: '나라 검색' })
  await search.focus()
  await search.pressSequentially('대한민국')

  const card = page.getByRole('complementary', { name: '나라별 채택 협약' })
  await expect(card).toBeVisible()
  await expect(card.getByText(/채택된 협약은 없어요/)).toBeVisible()
})
