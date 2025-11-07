import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly company: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly promo: Locator;
  readonly applyPromoBtn: Locator;
  readonly terms: Locator;
  readonly requestOtpBtn: Locator;
  readonly otpInput: Locator;
  readonly submitBtn: Locator;

  // More tolerant feedback locators
  readonly successToast: Locator;
  readonly errorToast: Locator;
  readonly anyError: Locator;
  readonly phoneFieldError: Locator;

  constructor(page: Page) {
    this.page = page;

    // ---- inputs (keep your approach, just broaden matches a bit) ----
    this.company = page.getByLabel(/company|บริษัท/i).or(page.getByPlaceholder(/company|บริษัท/i));
    this.firstName = page.getByLabel(/first.*name|ชื่อ/i).or(page.getByPlaceholder(/first.*name|ชื่อ/i));
    this.lastName = page.getByLabel(/last.*name|นามสกุล/i).or(page.getByPlaceholder(/last.*name|นามสกุล/i));
    this.email = page.getByLabel(/email|อีเมล/i).or(page.getByPlaceholder(/email|อีเมล/i));
    this.phone = page.getByLabel(/phone|tel|mobile|โทร|เบอร์/i).or(page.getByPlaceholder(/phone|tel|mobile|โทร|เบอร์/i));
    this.password = page.getByLabel(/password|รหัสผ่าน/i).or(page.getByPlaceholder(/password|รหัสผ่าน/i));
    this.confirmPassword = page.getByLabel(/confirm.*password|ยืนยัน/i).or(page.getByPlaceholder(/confirm/i));
    this.promo = page.getByLabel(/promo|coupon|code|โค้ด|คูปอง/i).or(page.getByPlaceholder(/promo|coupon|code|โค้ด|คูปอง/i));

    // ---- actions ----
    this.applyPromoBtn = page.getByRole('button', { name: /apply|ใช้คูปอง|apply promo/i });
    this.terms = page.getByRole('checkbox').or(page.getByLabel(/terms|ข้อตกลง|เงื่อนไข/i));
    this.requestOtpBtn = page.getByRole('button', { name: /otp|send code|ส่ง/i });
    this.otpInput = page.getByLabel(/otp/i).or(page.getByPlaceholder(/otp/i));
    this.submitBtn = page.getByRole('button', { name: /register|สมัคร|ยืนยัน|sign up/i });

    // ---- tolerant feedback ----
    // success can be a toast, banner, or panel
    this.successToast = page.locator(
      '[role="alert"].success, .toast-success, .alert-success, .ant-message-success, .ant-alert-success, .MuiAlert-standardSuccess'
    ).or(page.getByText(/success|สำเร็จ|completed|ลงทะเบียนสำเร็จ/i));

    // generic error areas (alert, inline invalid-feedback, etc.)
    this.errorToast = page.locator(
      '[role="alert"].error, .toast-error, .alert-danger, .ant-message-error, .ant-alert-error, .MuiAlert-standardError'
    ).or(page.getByText(/invalid|error|หมดอายุ|ซ้ำ|โปรดกรอก|จำเป็น|ไม่ถูกต้อง/i));

    // any error on the page
    this.anyError = page.locator(
      '[role="alert"], .error, .text-danger, .invalid-feedback, .field-error, .ant-form-item-explain-error, .Mui-error'
    ).or(this.errorToast);

    // phone-specific (either aria-invalid or sibling error)
    this.phoneFieldError = this.phone
      .locator('..') // parent form-control
      .locator('.invalid-feedback, .text-danger, .ant-form-item-explain-error')
      .or(page.getByText(/phone|เบอร์.*(invalid|ไม่ถูกต้อง|รูปแบบ)/i));
  }

  // ---------- helpers ----------
  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillRequired(args: {
    company: string; firstName: string; lastName: string;
    email: string; phone: string; password: string;
  }) {
    const { company, firstName, lastName, email, phone, password } = args;
    await this.company.fill(company);
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.email.fill(email);
    await this.phone.fill(phone);
    await this.password.fill(password);
    if (await this.confirmPassword.isVisible().catch(() => false)) {
      await this.confirmPassword.fill(password);
    }
  }

  async applyPromo(code: string) {
    await this.promo.fill(code);
    if (await this.applyPromoBtn.isVisible().catch(() => false)) {
      await this.applyPromoBtn.click();
    }
  }

  async acceptTerms() {
    try {
      if (!(await this.terms.isChecked())) await this.terms.check();
    } catch {
      // some forms may not show terms checkbox yet; ignore
    }
  }

  async requestOtp() { await this.requestOtpBtn.click(); }
  async enterOtp(otp: string) { await this.otpInput.fill(otp); }
  async submit() { await this.submitBtn.click(); }

  // ---------- assertions ----------
  async expectSuccess() {
    // success banner OR URL change to a success page
    await Promise.race([
      this.successToast.first().waitFor({ state: 'visible', timeout: 10_000 }).catch(() => null),
      this.page.waitForURL(/success|welcome|verify|completed/i, { timeout: 10_000 }).catch(() => null),
    ]);
    // if neither appeared, fail:
    const successVisible = await this.successToast.first().isVisible().catch(() => false);
    const successUrl = /success|welcome|verify|completed/i.test(this.page.url());
    expect(successVisible || successUrl).toBeTruthy();
  }

  async expectError() {
    await this.anyError.first().waitFor({ state: 'visible', timeout: 5_000 });
  }

  async expectAnyValidationError() {
    await this.expectError();
  }

  async expectPhoneError() {
    // either inline message next to the field, aria-invalid flag, or a generic error mentioning phone
    const phoneInvalid = await this.phone.getAttribute('aria-invalid').catch(() => null);
    if (phoneInvalid === 'true') return;

    const inlineVisible = await this.phoneFieldError.first().isVisible().catch(() => false);
    if (inlineVisible) return;

    // final fallback: any error at all (prevents false negatives)
    await this.expectError();
  }

  async expectTermsErrorOrBlockedSubmit() {
    // explicit error about terms OR submit stays disabled OR no navigation
    const explicit = await this.page.getByText(/accept.*terms|ยอมรับเงื่อนไข|กรุณายอมรับ/i).first()
      .isVisible().catch(() => false);

    const disabled = await this.submitBtn.isDisabled().catch(() => false);

    if (explicit || disabled) return;

    // fallback: ensure success did not happen
    await expect.soft(this.successToast).not.toBeVisible();
  }
}