import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { valid } from '../fixtures/data';

test.describe('Required Field Validations & Edge Cases', () => {
  test('submit empty form shows required errors', async ({ page }) => {
    const rp = new RegisterPage(page);
    await rp.goto();
    await rp.submit();
    await expect(page.getByText(/required|จำเป็น|โปรดกรอก/i)).toBeVisible();
  });

  test('invalid phone format rejected', async ({ page }) => {
    const rp = new RegisterPage(page);
    await rp.goto();
    await rp.fillRequired({
      company: valid.company,
      firstName: valid.first,
      lastName: valid.last,
      email: 'invalid-phone+' + Date.now() + '@example.com',
      phone: 'ABCDEF1234',
      password: valid.password
    });
    await rp.acceptTerms();
    await rp.requestOtp();
    await rp.expectError();
  });

  test('terms unchecked blocks submit', async ({ page }) => {
    const rp = new RegisterPage(page);
    await rp.goto();
    await rp.fillRequired({
      company: valid.company,
      firstName: valid.first,
      lastName: valid.last,
      email: 'terms+' + Date.now() + '@example.com',
      phone: valid.phone,
      password: valid.password
    });
    await rp.requestOtp();
    await rp.enterOtp(valid.otp);
    await rp.submit();
    await rp.expectError();
  });
});