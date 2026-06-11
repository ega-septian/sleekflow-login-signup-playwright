import { test } from "../fixtures/pages";
import { generateSignupEmail, signupPasswords } from "../test-data/auth";

test.describe("Signup flow", () => {
  test.describe.configure({ mode: "serial" });

  test(
    "open signup page from homepage",
    { tag: "@SIGNUP-001" },
    async ({ openSignupPage }) => {
      const signupPage = await openSignupPage();

      await signupPage.expectSignupFormVisible();
      await signupPage.expectSocialLoginButtonsVisible();
      await signupPage.expectMarketingContentVisible();
    },
  );

  test(
    "show validation error when submitting signup form without email",
    { tag: "@SIGNUP-002" },
    async ({ openSignupPage }) => {
      const signupPage = await openSignupPage();

      await signupPage.clickTermsCheckbox();
      await signupPage.clickSignUpButton();
      await signupPage.expectEmailEmptyError();
    },
  );

  test(
    "show validation error when submitting empty signup password",
    { tag: "@SIGNUP-003" },
    async ({ openSignupPage }) => {
      const signupPage = await openSignupPage();
      const email = generateSignupEmail();

      await signupPage.fillEmail(email);
      await signupPage.clickTermsCheckbox();
      await signupPage.clickSignUpButton();
      await signupPage.expectPasswordFormVisible();
      await signupPage.clickSignUpButton();
      await signupPage.expectPasswordRequiredError();
    },
  );

  test(
    "show validation error when submitting signup form without accepting terms",
    { tag: "@SIGNUP-004" },
    async ({ openSignupPage }) => {
      const signupPage = await openSignupPage();
      const email = generateSignupEmail();

      await signupPage.fillEmail(email);
      await signupPage.clickSignUpButton();
      await signupPage.expectTermsRequiredError();
    },
  );

  test(
    "show validation error when submitting weak signup password",
    { tag: "@SIGNUP-005" },
    async ({ openSignupPage }) => {
      const signupPage = await openSignupPage();
      const email = generateSignupEmail();

      await signupPage.fillEmail(email);
      await signupPage.clickTermsCheckbox();
      await signupPage.clickSignUpButton();
      await signupPage.expectPasswordFormVisible();
      await signupPage.fillPassword(signupPasswords.weakPassword);
      await signupPage.clickSignUpButton();
      await signupPage.expectPasswordTooWeakError();
    },
  );

  test(
    "complete signup with valid email and valid password",
    { tag: "@SIGNUP-006" },
    async ({ openSignupPage }) => {
      const signupPage = await openSignupPage();
      const email = generateSignupEmail();

      await signupPage.fillEmail(email);
      await signupPage.clickTermsCheckbox();
      await signupPage.clickSignUpButton();
      await signupPage.expectPasswordFormVisible();
      await signupPage.fillPassword(signupPasswords.validPassword);
      await signupPage.clickSignUpButton();
      await signupPage.expectEmailVerificationPageOpened();
    },
  );
});
