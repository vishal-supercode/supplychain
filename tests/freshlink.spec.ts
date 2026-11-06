import { test, expect } from '@playwright/test';

test.use({ channel: 'chrome', baseURL: process.env.TEST_BASE_URL || 'http://localhost:3011' });

test('solution navigation and FreshLink guided Kolar workflow', async ({ page }) => {
  const errors:string[]=[];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('link',{name:/FreshLink/})).toBeVisible();
  await page.getByRole('link',{name:/FreshLink/}).click();
  await expect(page.getByRole('heading',{name:'Farm to market, with freshness intact.'})).toBeVisible();
  for (let i=0;i<8;i++) await page.getByRole('button',{name:/Continue next step|Start guided demo/}).click();
  await expect(page.getByText('Buyer handover recorded').first()).toBeVisible();
  await page.getByRole('button',{name:'Bookings',exact:true}).click();
  const bookingIds = await page.locator('.fl-table-wrap tbody tr td:first-child b').allTextContents();
  expect(new Set(bookingIds).size).toBe(bookingIds.length);
  expect(bookingIds).toContain('BK-3103');
  await page.getByRole('button',{name:'Traceability',exact:true}).click();
  await expect(page.getByText('Bengaluru buyer handover').first()).toBeVisible();
  await page.getByRole('button',{name:'Generate QR passport'}).click();
  await expect(page.getByAltText('QR code for batch FL-26001')).toBeVisible();
  await page.getByRole('button',{name:'Close',exact:true}).click();
  await page.reload();
  await page.getByRole('button',{name:'Traceability',exact:true}).click();
  await expect(page.getByText('Bengaluru buyer handover').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('registration, storage compatibility, and alert actions', async ({ page }) => {
  const errors:string[]=[];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/freshlink');
  await page.getByRole('button',{name:'Batches',exact:true}).click();
  await page.getByRole('button',{name:'Register batch'}).click();
  await page.getByPlaceholder('e.g. Arka Rakshak').fill('Arka Rakshak');
  await page.getByRole('spinbutton',{name:'Quantity (kg)'}).fill('8000');
  await page.locator('.fl-modal').getByRole('button',{name:'Register batch'}).click();
  await expect(page.getByText('Arka Rakshak').first()).toBeVisible();
  await page.getByRole('button',{name:'Cold storage',exact:true}).click();
  await page.getByRole('button',{name:'Book storage'}).click();
  const dialog=page.locator('.fl-modal');
  await dialog.getByLabel('Produce batch').selectOption({index:1});
  await dialog.getByLabel('Facility').selectOption('FC-403');
  await dialog.getByRole('spinbutton',{name:'Capacity to reserve (kg)'}).fill('8000');
  await dialog.getByRole('button',{name:'Confirm booking'}).click();
  await expect(dialog.getByText(/does not support Tomatoes/)).toBeVisible();
  await dialog.getByLabel('Facility').selectOption('FC-401');
  await dialog.getByRole('button',{name:'Confirm booking'}).click();
  await expect(page.getByRole('heading',{name:'Bookings & transactions'})).toBeVisible();
  await page.getByRole('button',{name:'Temperature & alerts'}).click();
  await page.getByRole('button',{name:'Simulate warming'}).click();
  await page.getByRole('button',{name:'Simulate warming'}).click();
  await expect(page.locator('.fl-toast')).toContainText('Temperature alert triggered');
  page.once('dialog', dialog=>dialog.accept('Reefer reset; quality inspection scheduled.'));
  await page.getByRole('button',{name:'Resolve with action'}).first().click();
  await expect(page.getByText('Reefer reset; quality inspection scheduled.')).toBeVisible();
  expect(errors).toEqual([]);
});

test('mobile navigation and third solution status', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('/freshlink');
  await page.getByRole('button',{name:'',exact:true}).first();
  await page.locator('.fl-mobile-menu').click();
  await page.getByRole('button',{name:'Batches',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Produce batches'})).toBeVisible();
  await page.getByRole('link',{name:/SupplyLens/}).click();
  await expect(page.getByRole('heading',{name:'See beyond your suppliers.'})).toBeVisible();
});
