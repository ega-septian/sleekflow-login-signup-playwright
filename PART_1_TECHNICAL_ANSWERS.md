# Technical Answers

Part 1: Playwright signup and login automation test for SleekFlow.

## 1. Project Setup

I initialized the project as a Playwright Test project using Node.js and TypeScript. The project uses `@playwright/test` as the test runner, with configuration stored in `playwright.config.ts`.

The project is structured by responsibility:

- `tests/` contains the test cases.
- `pages/` contains Page Object Model classes.
- `fixtures/` contains reusable Playwright fixtures.
- `test-data/` contains test data helpers.
- `.env.example` documents required environment variables.
- `.github/workflows/playwright.yml` runs the suite in GitHub Actions.


## 2. Test Case Planning

For the signup flow, I identify and test these key elements:

- Signup page opens from the homepage using the **Start for Free** button.
- Signup form header, email field, terms checkbox, signup button, sign-in link, social buttons, and marketing content are visible.
- Empty email validation is displayed.
- Terms and conditions validation is displayed.
- Empty password validation is displayed.
- Weak password validation is displayed.
- Successful signup redirects to the email confirmation page.

For the login flow, I include these validation steps:

- Login page opens from the homepage using the header sign-in button.
- Login form header, email/username field, continue button, sign-up link, social login buttons, and marketing slides are visible.
- Empty email/username submission shows a required error.
- Valid credentials reach the inbox page.
- Invalid password shows an error message.
- Empty password shows a required error.


## 3. Locator Strategy

I prefer locators that match how users interact with the page:

- `getByRole()` for buttons, links, headings, and checkboxes.
- `getByLabel()` for form inputs when accessible labels are available.
- `getByText()` for user-visible messages.
- CSS selectors for stable technical selectors such as IDs or classes.

In this project, examples include:

- Login email field: `getByRole("textbox", { name: /email or username/i })`
- Signup email field: `getByLabel(/email address/i)`
- Empty username error: `locator("#error-cs-username-required")`
- Terms checkbox: `locator("#terms-of-service")`

This approach keeps selectors readable.

## 4. Waits and Timing

I rely on Playwright auto-waiting and web-first assertions instead of fixed sleeps.

Examples used in this project:

- `await expect(locator).toBeVisible()`
- `await expect(page).toHaveURL(...)`
- `await page.waitForURL(...)`
- `await Promise.all([context.waitForEvent("page"), clickAction])`

For login and signup, the homepage opens the auth page in a new tab, so the fixture waits for the new page event and then waits for the expected URL. This makes the test more stable than using arbitrary timeouts or `waitForTimeout`.

## 5. Test Data Management

Test data is kept outside the spec files.

Login data is stored in environment variables:

- `LOGIN_EMAIL`
- `LOGIN_PASSWORD`
- `INVALID_LOGIN_PASSWORD`

Signup password data is also stored in environment variables:

- `SIGNUP_VALID_PASSWORD`
- `SIGNUP_WEAK_PASSWORD`

For new signup users, the project generates unique emails using:

```text
Date.now()-sleekflow@yopmail.com
```

This reduces duplicate account conflicts during repeated runs. In a real company test environment, I would also recommend either cleaning up test users through an API or using a dedicated test environment to avoid cluttering production data.

## 6. Reusability

The project uses Page Object Model and Playwright fixtures for reuse.

The Page Object Model keeps page-specific selectors and actions inside:

- `HomePage.ts`
- `LoginPage.ts`
- `SignupPage.ts`

Fixtures in `fixtures/pages.ts` provide reusable flows:

- `openLoginPage`
- `openSignupPage`

This keeps the test files simple. For example, tests can call `const loginPage = await openLoginPage();` and then focus only on the test scenario instead of repeating homepage navigation and tab handling in every test.

## 7. Headless vs Headed

I run tests in headed mode locally when debugging because it is easier to see the browser behavior, redirects, validation messages, and UI changes.

I run tests in headless mode in CI because it is faster and more suitable for automated pipelines.

In this project, `playwright.config.ts` uses:

```ts
headless: !!process.env.CI
```

This means local runs are headed by default, while GitHub Actions runs are headless. For deeper debugging, I can also use:

```bash
npm run test:debug
```

## 8. CI Integration

The project integrates with GitHub Actions through:

```text
.github/workflows/playwright.yml
```

The workflow runs on:

- Manual trigger from the GitHub Actions tab.
- Push to the `main` branch.
- Pull request.

The workflow installs dependencies with `npm ci`, installs the Chromium browser with Playwright dependencies, runs `npm test`, and uploads the Playwright HTML report as an artifact.

Sensitive values are provided through GitHub repository secrets:

- `LOGIN_EMAIL`
- `LOGIN_PASSWORD`
- `INVALID_LOGIN_PASSWORD`
- `SIGNUP_VALID_PASSWORD`
- `SIGNUP_WEAK_PASSWORD`

## 9. Error Handling

For failed tests, the project captures debugging artifacts through Playwright configuration:

- Screenshots are captured only on failure.
- Videos are retained only on failure.
- Traces are captured on first retry.
- HTML reports are generated after the run.
- GitHub Actions uploads the Playwright report as an artifact.