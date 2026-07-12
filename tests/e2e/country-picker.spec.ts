import { test, expect } from '@playwright/test'

// 지구본(WebGL)은 키보드로 못 누르므로, '나라 검색'으로 키보드만으로 나라를 고를 수 있어야 한다.
test('키보드로 나라를 검색해 선택하면 정보 카드가 뜬다', async ({ page }) => {
  await page.goto('/')

  // <label for>로 연결된 접근 가능한 입력(list 속성 → combobox)을 찾는다.
  const search = page.getByRole('combobox', { name: '나라 검색' })
  await expect(search).toBeVisible()

  // 마우스 없이: 포커스 → 타이핑 → 목록의 정확 일치로 선택
  await search.focus()
  await search.pressSequentially('대한민국')

  const card = page.getByRole('complementary', { name: '나라 정보' })
  await expect(card).toBeVisible()
  await expect(card.getByText('대한민국')).toBeVisible()
})

// 세리프 서브셋(@font-face)이 실제로 등록·로드되는지 — 통짜 1MB 대신 자체 서브셋.
test('세리프 서브셋 폰트가 로드된다(글자 깨짐 방지)', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const loaded = await page.evaluate(() => document.fonts.check('700 22px "Noto Serif KR"'))
  expect(loaded).toBe(true)
})
