import { expect, Locator, Page } from "@playwright/test";

export class HomePage {
  private readonly headerSignUpButton: Locator;
  private readonly headerSignInButton: Locator;

  constructor(private readonly page: Page) {
    this.headerSignUpButton = this.page
      .locator('a.sign-up-cta[href*="screen_hint=signup"]:visible')
      .first();
    this.headerSignInButton = this.page
      .locator('a.sign-in-cta[href*="screen_hint=login"]:visible')
      .first();
  }

  async goto() {
    await this.page.goto("/");
  }

  async expectPageLoaded() {
    await expect(this.page).toHaveTitle(/SleekFlow/i);
    await expect(this.headerSignUpButton).toBeVisible();
    await expect(this.headerSignInButton).toBeVisible();
  }

  async clickHeaderSignUpButton() {
    await this.headerSignUpButton.click();
  }

  async clickHeaderSignInButton() {
    await this.headerSignInButton.click();
  }
}
