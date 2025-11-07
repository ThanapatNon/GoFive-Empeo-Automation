# Empeo Registration Automation Test (Thanapat Nonpassopon)

This project contains automated test scripts for the **Empeo registration system** — an HR platform designed to empower organizations through efficient HRM and HRD workflows.

The automation is implemented using **Playwright + TypeScript** and covers both functional and edge-case validations for the registration flow.

---

## Project Overview

**Goal:**  
To design and implement a complete end-to-end test suite that validates the **Empeo registration system** at  
👉 https://uat.tks.co.th/ClientPortal/Register/empeo

**Main Focus Areas:**
- Successful registration with valid data  
- OTP verification flow (valid, invalid, expired)  
- Promo code validation (valid, invalid, reused)  
- Required field and error message validations  
- Edge cases (invalid phone, missing terms, etc.)

---

## Tech Stack

| Component | Technology |
|------------|-------------|
| Test Framework | Playwright |
| Language | TypeScript |
| Test Runner | @playwright/test |
| CI/CD | GitHub Actions |
| Formatter | Prettier |

---

## Test Scenarios (High-Level)

| Category | Test Case | Description |
|-----------|------------|-------------|
| **Form Validations** | Submit empty form | Ensures required field messages appear |
|  | Invalid phone number | Rejects non-numeric or too-short numbers |
|  | Terms unchecked | Blocks form submission without accepting terms |
| **Promo Code** | Valid promo applied | Accepts `FREE15DAY` promo successfully |
|  | Invalid promo | Rejects fake or expired promo code |
|  | Reused promo | Detects already-used promo codes |
| **OTP Flow** | Valid OTP | Verifies successful code submission |
|  | Invalid OTP | Rejects wrong or malformed OTP |
|  | Expired OTP | Simulates an expired OTP scenario |
| **Success Path** | Full registration | Completes registration with all valid data |


---

## Test Case Design

| ID | Feature | Scenario | Steps | Expected Result |
|----|----------|-----------|--------|----------------|
| TC01 | Registration | Submit empty form | 1. Go to registration page<br>2. Click “Register” | Required field messages appear |
| TC02 | Registration | Invalid phone number | 1. Enter “123” as phone<br>2. Click “Register” | Validation error “Invalid phone number” shown |
| TC03 | Terms Checkbox | Submit without accepting terms | 1. Fill all fields<br>2. Leave Terms unchecked<br>3. Click “Register” | Error “Please accept terms” shown |
| TC04 | Promo Code | Apply valid promo | 1. Enter `FREE15DAY`<br>2. Click “Apply” | Promo accepted successfully |
| TC05 | OTP | Enter invalid OTP | 1. Enter wrong OTP `999999`<br>2. Submit | Error message “Invalid OTP” displayed |
| TC06 | OTP | Enter expired OTP | 1. Enter old OTP<br>2. Submit | Error message “OTP expired” displayed |
| TC07 | Happy Path | Full valid registration | 1. Fill all required data<br>2. Apply promo<br>3. Verify OTP<br>4. Submit | Registration completed successfully |

---

## Setup & Installation

### Clone this repository
```bash
git clone https://github.com/ThanapatNon/GoFive-Empeo-Automation.git
cd GoFive-Empeo-Automation
```
### Run the command to run the test
```bash
npm install
npx playwright install --with-deps
npm run test
```

### After that, to see the HTML Report run this command
```bash
npx playwright show-report
```
---

## How to Reproduce

	1.  Clone the repo
	2.	Run npm install
	3.	Execute npm run test:headed
	4.	Observe validations and OTP/promo test flows in real browsers
	5.	View reports via npm run report

---

## Demo Video

A demo recording of the test run is provided showing test execution in Playwright UI and report review.
Feel free to watch the video recording >> https://drive.google.com/file/d/1HEDuJLEnX8ejlhjusQ3EW-sT8LDtm4b0/view?usp=sharing

---

## Conclusion

This project provides a complete, CI-ready automation suite for the Empeo registration system.
It demonstrates proficiency in Playwright, CI/CD integration, and QA coverage planning for real-world HR web applications.

---
## Author

Mr. Thanapat Nonpassopon 
(Automate Tester Candidate)

thanapat.nonp@gmail.com

---
