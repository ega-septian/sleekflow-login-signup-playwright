# SleekFlow Auth E2E Playwright

End-to-end automation tests for the SleekFlow signup and login flows using Playwright and TypeScript.

This project covers the main authentication scenarios requested in Part 1 of the technical assignment: project setup, page object structure, reusable fixtures, environment-based test data, login validation, signup validation, successful signup flow, and Playwright reporting artifacts.

## Tech Stack

- Playwright
- TypeScript
- dotenv
- Page Object Model
- Playwright fixtures

## Project Structure

```text
.
├── fixtures/
│   └── pages.ts
├── pages/
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   └── SignupPage.ts
├── test-data/
│   └── auth.ts
├── tests/
│   ├── login.spec.ts
│   └── signup.spec.ts
├── .env.example
├── playwright.config.ts
└── package.json
```

## Setup

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

Create a local environment file:

```bash
cp .env.example .env
```

Update `.env` with valid test credentials.

## Environment Variables

The project reads test data from `.env` using `dotenv`. The `.env` file is intentionally ignored by Git because it can contain real credentials.

Required variables:

```env
BASE_URL=https://sleekflow.io

LOGIN_EMAIL=your-login-email@example.com
LOGIN_PASSWORD=your-login-password
INVALID_LOGIN_PASSWORD=wrong-password

SIGNUP_VALID_PASSWORD=your-valid-signup-password
SIGNUP_WEAK_PASSWORD=abc
```

Notes:

- Keep `.env` local and do not commit it.
- Commit `.env.example` only, so reviewers know which variables are required.
- Use a real login account for `LOGIN_EMAIL` and `LOGIN_PASSWORD`.
- Signup tests generate a new email using the `Date.now()-sleekflow@yopmail.com` format.

## Running Tests

Run all tests:

```bash
npm test
```

Run tests in headed mode:

```bash
npm run test:headed
```

Run tests in debug mode:

```bash
npm run test:debug
```

Open the Playwright HTML report:

```bash
npm run report
```

Run a specific test by tag:

```bash
npx playwright test --grep @LOGIN-001
```

Examples:

```bash
npx playwright test --grep @LOGIN-003
npx playwright test --grep @SIGNUP-006
```

## Test Coverage

Login test cases:

- `@LOGIN-001` opens the login page from the homepage.
- `@LOGIN-002` validates the empty login form.
- `@LOGIN-003` logs in with valid credentials.
- `@LOGIN-004` validates an invalid password.
- `@LOGIN-005` validates an empty password.

Signup test cases:

- `@SIGNUP-001` opens the signup page from the homepage.
- `@SIGNUP-002` validates signup without email.
- `@SIGNUP-003` validates an empty signup password.
- `@SIGNUP-004` validates signup without accepting terms.
- `@SIGNUP-005` validates a weak signup password.
- `@SIGNUP-006` completes signup with a generated email and valid password, then validates the email confirmation page.

## CAPTCHA Limitation

SleekFlow authentication is served through a public SSO flow. During repeated automation runs, the application may show a CAPTCHA challenge based on risk signals such as IP address, browser fingerprint, traffic frequency, or failed attempts.

CAPTCHA is intentionally not bypassed or automated in this project. This is the expected and ethical approach for an end-to-end test suite against a real public authentication system.

If CAPTCHA appears, tests that need to continue past the CAPTCHA step can fail even when the automation code is correct. In a real test environment, the recommended options are:

- Use a dedicated test environment where CAPTCHA is disabled.
- Allowlist automation traffic for test accounts.
- Use backend/API test setup for accounts and reserve UI tests for validation.
- Run CAPTCHA-sensitive tests less frequently.

## Playwright Configuration

The Playwright config includes:

- `baseURL` loaded from `.env`.
- HTML reporter.
- Screenshots only on failure.
- Videos retained on failure.
- Trace collection on first retry.
- One worker to reduce risk detection on the external SSO flow.
- CI retry configuration.

## Reviewer Notes

- The project uses Page Object Model to keep selectors and page actions inside `pages/`.
- Fixtures in `fixtures/pages.ts` provide reusable navigation flows from the homepage to login and signup pages.
- Test data and generated emails are isolated in `test-data/auth.ts`.
- Secrets are not committed; reviewers should create their own `.env` from `.env.example`.
- Full test execution depends on the live SleekFlow/Auth0 flow, so external changes or CAPTCHA challenges can affect results.
