import { test } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { valid } from '../fixtures/data';

test.describe('Registration - Happy Path', () => {
  test('registers successfully with promo and OTP', async ({ page }) => {
    const rp = new RegisterPage(page);
    await rp.goto();

    await rp.fillRequired({
      company: valid.company,
      firstName: valid.first,
      lastName: valid.last,
      email: valid.email,
      phone: valid.phone,
      password: valid.password
    });

    await rp.applyPromo(valid.promo);
    await rp.acceptTerms();
    await rp.requestOtp();
    await rp.enterOtp(valid.otp);
    await rp.submit();

    await rp.expectSuccess();
  });
});