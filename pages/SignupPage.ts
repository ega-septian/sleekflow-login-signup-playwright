import { expect, Page } from "@playwright/test";

export class SignupPage {
  private readonly expectedMarketingContent = [
    "Turn customer conversations into revenue",
    "Unified Inbox experience",
    "Manage customer conversations across WhatsApp, Facebook, and more",
    "AI agents for scalable customer conversations",
    "Handle common questions, qualify leads, and follow up automatically",
    "TRUSTED BY 2,000+ BUSINESSES",
  ];

  constructor(private readonly page: Page) {}

  get screenHeader() {
    return this.page.locator("#screen-header");
  }

  get heading() {
    return this.screenHeader.getByRole("heading", {
      name: /create your account/i,
    });
  }

  get subtitle() {
    return this.screenHeader.getByText(
      "Sign up for your SleekFlow account to continue",
    );
  }

  get emailInput() {
    return this.page.getByLabel(/email address/i);
  }

  get termsCheckbox() {
    return this.page.locator("#terms-of-service");
  }

  get termsField() {
    return this.page.locator(".ulp-field").filter({ has: this.termsCheckbox });
  }

  get signUpButton() {
    return this.page.getByRole("button", { name: /^sign up$/i });
  }

  get googleLoginButton() {
    return this.page.getByRole("button", { name: /continue with google/i });
  }

  get appleLoginButton() {
    return this.page.getByRole("button", { name: /continue with apple/i });
  }

  get signInLink() {
    return this.page.getByRole("link", { name: /^sign in$/i });
  }

  get emailRequiredError() {
    return this.page.locator("#error-cs-email-required");
  }

  get passwordSubtitle() {
    return this.page.getByText(
      "Fill in details to sign up for your SleekFlow account",
    );
  }

  get passwordInput() {
    return this.page.getByRole("textbox", { name: /^password$/i });
  }

  get editEmailAddressLink() {
    return this.page.getByRole("link", { name: /edit email address/i });
  }

  get passwordRequiredError() {
    return this.page.locator("#error-cs-password-required");
  }

  get termsRequiredError() {
    return this.termsField.locator(".ulp-error-info.ulp-validator-error");
  }

  get passwordTooWeakError() {
    return this.page.locator("#error-cs-password-password-too-weak");
  }

  get confirmEmailMessage() {
    return this.page.getByText("Confirm your email address");
  }

  get signOutButton() {
    return this.page.getByRole("button", { name: /^sign out$/i });
  }

  async expectSignupFormVisible() {
    await this.expectHeaderVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.termsCheckbox).toBeVisible();
    await expect(this.signUpButton).toBeVisible();
    await expect(this.signInLink).toBeVisible();
  }

  async expectHeaderVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.subtitle).toBeVisible();
  }

  async expectSocialLoginButtonsVisible() {
    await expect(this.googleLoginButton).toBeVisible();
    await expect(this.googleLoginButton).toBeEnabled();

    await expect(this.appleLoginButton).toBeVisible();
    await expect(this.appleLoginButton).toBeEnabled();
  }

  async expectMarketingContentVisible() {
    for (const text of this.expectedMarketingContent) {
      await expect(this.page.getByText(text, { exact: false })).toBeVisible();
    }
  }

  async expectPasswordFormVisible() {
    await expect(this.heading).toBeVisible();
    await expect(this.passwordSubtitle).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signUpButton).toBeVisible();
    await expect(this.editEmailAddressLink).toBeVisible();
    await expect(this.signInLink).toBeVisible();
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickTermsCheckbox() {
    await this.termsCheckbox.click({ force: true });
    await expect(this.termsCheckbox).toBeChecked();
  }

  async clickSignUpButton() {
    await this.signUpButton.click();
  }

  async expectEmailEmptyError() {
    await expect(this.emailRequiredError).toContainText(
      /please enter an email address/i,
    );
  }

  async expectPasswordRequiredError() {
    await expect(this.passwordRequiredError).toContainText(
      /password is required/i,
    );
  }

  async expectTermsRequiredError() {
    await expect(this.termsRequiredError).toContainText(/this is required/i);
  }

  async expectPasswordTooWeakError() {
    await expect(this.passwordTooWeakError).toContainText(
      /the password is too weak/i,
    );
  }

  async expectEmailVerificationPageOpened() {
    await expect(this.page).toHaveURL(
      /app\.sleekflow\.io\/en\/.*error=access_denied/,
      {
        timeout: 30000,
      },
    );
    await expect(this.confirmEmailMessage).toBeVisible();
    await expect(
      this.page.getByText(/we've sent a verification email/i),
    ).toBeVisible();
    await expect(this.signOutButton).toBeVisible();
  }

}
