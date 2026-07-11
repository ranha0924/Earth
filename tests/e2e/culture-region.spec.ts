import { test, expect } from '@playwright/test'

// 세계 문화권 레이어: 탭 전환 → 범례 9개 → 범례/나라 클릭 시 문화권 상세 카드
test('문화권 레이어가 색칠·범례·카드로 동작한다', async ({ page }) => {
  await page.goto('/')

  // 문화 모드 → 문화권 탭
  await page.getByRole('button', { name: '문화' }).click()
  await page.getByRole('tab', { name: /문화권/ }).click()

  // 범례에 9개 문화권이 보인다
  for (const label of [
    '동아시아', '동남아시아', '인도', '건조', '유럽', '아프리카', '앵글로', '라틴', '오세아니아',
  ]) {
    await expect(page.getByRole('button', { name: new RegExp(label) })).toBeVisible()
  }

  // 동아시아 범례 클릭 → 상세 카드(제목·종교·시험 포인트)
  await page.getByRole('button', { name: /동아시아/ }).click()
  await expect(page.getByRole('heading', { name: /동아시아 문화권/ })).toBeVisible()
  await expect(page.getByText('유교·불교·도교')).toBeVisible()
  await expect(page.getByText(/시험 포인트/)).toBeVisible()
})
