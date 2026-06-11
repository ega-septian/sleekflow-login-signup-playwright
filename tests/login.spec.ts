import { test } from "../fixtures/pages";
import { testUsers } from "../test-data/auth";

test.describe("Login flow", () => {
  test("open login page from homepage",
    { tag: "@LOGIN-001" },
    async ({ openLoginPage }) => {
      const loginPage = await openLoginPage();

      await loginPage.expectLoginFormVisible();
      await loginPage.expectSocialLoginButtonsVisible();
      await loginPage.expectSlidesVisible();
    },
  );

  test("show validation error when submitting empty login form",
    { tag: "@LOGIN-002" },
    async ({ openLoginPage }) => {
      const loginPage = await openLoginPage();

      await loginPage.clickContinueButton();
      await loginPage.expectUsernameEmptyError();
    },
  );

  test("login successfully with valid credentials",
    { tag: "@LOGIN-003" },
    async ({ openLoginPage }) => {
      const loginPage = await openLoginPage();

      await loginPage.fillEmailOrUsername(testUsers.validLoginEmail);
      await loginPage.clickContinueButton();
      await loginPage.expectPasswordFormVisible();
      await loginPage.fillPassword(testUsers.validLoginPassword);
      await loginPage.clickSignInButton();
      await loginPage.expectInboxPageOpened();
    },
  );

  test("show error when password is invalid",
    { tag: "@LOGIN-004" },
    async ({ openLoginPage }) => {
      const loginPage = await openLoginPage();

      await loginPage.fillEmailOrUsername(testUsers.validLoginEmail);
      await loginPage.clickContinueButton();
      await loginPage.expectPasswordFormVisible();
      await loginPage.fillPassword(testUsers.invalidLoginPassword);
      await loginPage.clickSignInButton();
      await loginPage.expectInvalidPasswordError();
    },
  );

  test("show validation error when submitting empty password",
    { tag: "@LOGIN-005" },
    async ({ openLoginPage }) => {
      const loginPage = await openLoginPage();

      await loginPage.fillEmailOrUsername(testUsers.validLoginEmail);
      await loginPage.clickContinueButton();
      await loginPage.expectPasswordFormVisible();
      await loginPage.clickSignInButton();
      await loginPage.expectPasswordRequiredError();
    },
  );
});
