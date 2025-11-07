import * as dotenv from 'dotenv';
dotenv.config();

const env = (k: string, d: string) => process.env[k] ?? d;

export const valid = {
  company: env('TEST_COMPANY', 'Acme Test Co., Ltd.'),
  first:   env('TEST_FIRST', 'Thanapat'),
  last:    env('TEST_LAST', 'Automation'),
  email:   env('TEST_EMAIL', `thanapat.automation+${Date.now()}@example.com`),
  phone:   env('TEST_PHONE', '0967690708'),
  password:env('TEST_PASSWORD','Password!234'),
  promo:   env('TEST_PROMO', 'FREE15DAY'),
  otp:     env('TEST_OTP', '123456')
};

export const invalid = {
  phones: ['08123', 'ABCDEF1234', '1234567890123'],
  emails: ['user-at-domain', 'x@', 'x@x', ' x @x.com '],
  passwords: ['123456', 'password', 'aaaaaa'],
  promo: ['NOT-A-CODE']
};