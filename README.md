# SleekFlow Auth E2E Playwright

End-to-end automation tests for the SleekFlow signup and login flows using Playwright and TypeScript.

This project covers the main authentication scenarios requested in Part 1 of the technical assignment: project setup, page object structure, reusable fixtures, environment-based test data, login validation, signup validation, successful signup flow, and Playwright reporting artifacts.

## Assignment Answers

The written answers for the technical assignment are available in:

- [Part 1 Technical Answers](PART_1_TECHNICAL_ANSWERS.md)
- [Part 2 Test Case Design and Bug Report](PART_2_TEST_CASE_DESIGN_AND_BUG_REPORT.md)

## Tech Stack

- Playwright
- TypeScript
- dotenv
- Page Object Model
- Playwright fixtures

## Project Structure

```text
.
├── .github/
│   ├── workflows/
│   │   └── playwright.yml
│   └── pull_request_template.md
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
├── PART_1_TECHNICAL_ANSWERS.md
├── PART_2_TEST_CASE_DESIGN_AND_BUG_REPORT.md
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


## Running Tests

Run all suites:

```bash
npm test
```

Run the login suite:

```bash
npm run test:login
```

Run the signup suite:

```bash
npm run test:signup
```

Run a specific test by tag:

```bash
npx playwright test --grep @LOGIN-003
```

Example:

```bash
npx playwright test --grep @SIGNUP-006
```

Open the Playwright HTML report:

```bash
npm run report
```

## GitHub Actions

This project includes a GitHub Actions workflow for running Playwright tests in CI.

The workflow runs on:

- Manual trigger from the **Actions** tab
- Push to the `main` branch
- Pull request

To run it manually:

1. Open the repository on GitHub.
2. Go to **Actions**.
3. Select **Playwright Tests**.
4. Click **Run workflow**.
5. Choose the branch and run it.

Required repository secrets:

- `LOGIN_EMAIL`
- `LOGIN_PASSWORD`
- `INVALID_LOGIN_PASSWORD`
- `SIGNUP_VALID_PASSWORD`
- `SIGNUP_WEAK_PASSWORD`

The Playwright HTML report is uploaded as a workflow artifact after each run.

## Pull Request Template

This repository includes a pull request template in `.github/pull_request_template.md`.

The template helps document:

- Summary of changes
- Test evidence
- Test scope
- Reviewer notes
- Screenshots or report links when relevant

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

SleekFlow uses a public SSO flow, so CAPTCHA may appear during repeated automation runs.

CAPTCHA is not bypassed or automated in this project. If CAPTCHA appears, tests that need to continue past that step may fail even when the automation code is correct.

For stable automation, the recommended options are:

- Use a test environment where CAPTCHA is disabled.
- Allowlist test accounts or automation traffic.

## Playwright Configuration

The Playwright config includes:

- `baseURL` loaded from `.env`.
- HTML reporter.
- Screenshots only on failure.
- Videos retained on failure.
- Trace collection on first retry.
- One worker to reduce risk detection on the external SSO flow.
- Browser scope is Chromium/Desktop Chrome only. Firefox and WebKit are intentionally not enabled for this assignment.
- CI retry configuration.

## Reviewer Notes

- The project uses Page Object Model to keep selectors and page actions inside `pages/`.
- Fixtures in `fixtures/pages.ts` provide reusable navigation flows from the homepage to login and signup pages.
- Test data and generated emails are isolated in `test-data/auth.ts`.
- Secrets are not committed; reviewers should create their own `.env` from `.env.example`.
