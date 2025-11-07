import { test } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { valid } from '../fixtures/data';

test.describe('Registration - OTP Flows', () => {
  test.beforeEach(async ({ page }) => {
    const rp = new RegisterPage(page);
    await rp.goto();
    await rp.fillRequired({
      company: valid.company,
      firstName: valid.first,
      lastName: valid.last,
      email: 'otp+' + Date.now() + '@example.com',
      phone: valid.phone,
      password: valid.password
    });
    await rp.acceptTerms();
  });

  test('OTP accepted', async ({ page }) => {
    const rp = new RegisterPage(page);
    await rp.requestOtp();
    await rp.enterOtp(valid.otp);
    await rp.submit();
    await rp.expectSuccess();
  });

  test('OTP invalid', async ({ page }) => {
    const rp = new RegisterPage(page);
    await rp.requestOtp();
    await rp.enterOtp('000000');
    await rp.submit();
    await rp.expectError();
  });

  test('OTP expired', async ({ page }) => {
    const rp = new RegisterPage(page);
    await rp.requestOtp();
    await page.waitForTimeout(130_000);
    await rp.enterOtp(valid.otp);
    await rp.submit();
    await rp.expectError();
  });
});