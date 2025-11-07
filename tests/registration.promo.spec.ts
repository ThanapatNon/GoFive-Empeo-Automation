import { test } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { valid, invalid } from '../fixtures/data';

test.describe('Promo Code', () => {
  test('valid promo applies', async ({ page }) => {
    const rp = new RegisterPage(page);
    await rp.goto();
    await rp.fillRequired({
      company: valid.company,
      firstName: valid.first,
      lastName: valid.last,
      email: 'promo-valid+' + Date.now() + '@example.com',
      phone: valid.phone,
      password: valid.password
    });
    await rp.applyPromo(valid.promo);
    await page.getByText(/applied|ส่วนลด|สำเร็จ/i).waitFor();
  });

  test('invalid promo rejected', async ({ page }) => {
    const rp = new RegisterPage(page);
    await rp.goto();
    await rp.fillRequired({
      company: valid.company,
      firstName: valid.first,
      lastName: valid.last,
      email: 'promo-invalid+' + Date.now() + '@example.com',
      phone: valid.phone,
      password: valid.password
    });
    await rp.applyPromo(invalid.promo[0]);
    await rp.expectError();
  });

  test('reused promo blocked', async ({ page }) => {
    const rp = new RegisterPage(page);
    await rp.goto();
    await rp.fillRequired({
      company: valid.company,
      firstName: valid.first,
      lastName: valid.last,
      email: 'promo-reuse+' + Date.now() + '@example.com',
      phone: valid.phone,
      password: valid.password
    });
    await rp.applyPromo(valid.promo);
    await rp.acceptTerms();
    await rp.requestOtp();
    await rp.enterOtp(valid.otp);
    await rp.submit();
    await rp.expectError();
  });
});