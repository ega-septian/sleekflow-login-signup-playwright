import { expect, test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";

type PageFixtures = {
  homePage: HomePage;
  openLoginPage: () => Promise<LoginPage>;
  openSignupPage: () => Promise<SignupPage>;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  openLoginPage: async ({ page, homePage }, use) => {
    await use(async () => {
      await homePage.goto();
      await homePage.expectPageLoaded();

      const [loginTab] = await Promise.all([
        page.context().waitForEvent("page"),
        homePage.clickHeaderSignInButton(),
      ]);

      await loginTab.waitForURL("**/u/login/identifier**", {
        timeout: 30000,
      });

      const loginPage = new LoginPage(loginTab);

      return loginPage;
    });
  },

  openSignupPage: async ({ page, homePage }, use) => {
    await use(async () => {
      await homePage.goto();
      await homePage.expectPageLoaded();

      const [signupTab] = await Promise.all([
        page.context().waitForEvent("page"),
        homePage.clickHeaderSignUpButton(),
      ]);

      await signupTab.waitForURL("**/u/signup/identifier**", {
        timeout: 30000,
      });

      const signupPage = new SignupPage(signupTab);

      return signupPage;
    });
  },
});

export { expect };
