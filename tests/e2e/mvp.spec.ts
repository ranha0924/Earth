import { test, expect } from '@playwright/test'

test('앱이 로딩되고 핵심 UI가 보인다', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /세계 탐구 도감/ })).toBeVisible()
  for (const label of ['기후', '환경', '문화', '퀴즈']) {
    await expect(page.getByRole('button', { name: label })).toBeVisible()
  }
  await expect(page.getByTestId('globe')).toBeVisible()
})

test('기후 범례 6개가 텍스트 라벨과 함께 보이고 클릭하면 활성화된다', async ({ page }) => {
  await page.goto('/')
  for (const label of ['열대', '건조', '온대', '냉대', '한대', '고산']) {
    await expect(page.getByRole('button', { name: new RegExp(label) })).toBeVisible()
  }
  const target = page.getByRole('button', { name: /온대/ })
  await target.click()
  await expect(target).toHaveAttribute('aria-pressed', 'true')
})

test('globe canvas가 그려진다', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="globe"] canvas')).toBeVisible({ timeout: 15_000 })
})
