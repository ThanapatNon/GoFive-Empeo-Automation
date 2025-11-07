# Empeo Registration — Test Cases

## Scope
URL: https://uat.tks.co.th/ClientPortal/Register/empeo

## Data (fixed per brief)
- Phone: 0967690708
- OTP: 123456
- Promo: FREE15DAY

## A. Happy Path
**Scenario:** Register with valid details, apply promo, verify OTP  
**Steps:** Fill company/first/last/email/phone/password → Apply promo → Request OTP → Enter OTP → Submit  
**Expected:** Registration completes (success banner or success URL)

## B. OTP Flows
1) OTP accepted → Expect success  
2) OTP invalid (“000000”) → Expect invalid-OTP error  
3) OTP expired → Wait > expiry → Expect “expired” flow / new OTP required

## C. Promo Code
1) Valid promo (FREE15DAY) → Applied  
2) Invalid promo (“NOT-A-CODE”) → Rejected  
3) Reused promo → Blocked with error

## D. Required Fields & Edge Cases
- Submit empty form → required-field errors visible  
- Invalid phone (letters/too short) → validation prevents progress  
- Invalid email → format error  
- Weak password → strength/complexity error  
- Terms unchecked → cannot complete

## Notes
- Assertions tolerant to Thai/English messages & common UI frameworks.
- Unique email per run (`qa+{timestamp}@example.com`) to avoid collisions.