import { expect, Page } from "@playwright/test";

export class LoginPage {
  private readonly expectedSlides = [
    {
      index: 0,
      title: "Collaborate on key conversations",
      description:
        "Combine all your messaging channels into one and work together efficiently across teams",
    },
    {
      index: 1,
      title: "Scale with powerful integrations",
      description:
        "Merge data and functions from Salesforce, HubSpot, and more.",
    },
    {
      index: 2,
      title: "Broadcast messages with WhatsApp Business API",
      description: "Blast personalized, promotional WhatsApp messages",
    },
    {
      index: 3,
      title: "Get paid instantly in the chat",
      description: "Connect to your e-commerce shop or import catalogs",
    },
  ];

  constructor(private readonly page: Page) {}

  get screenHeader() {
    return this.page.locator("#screen-header");
  }

  get heading() {
    return this.screenHeader.getByRole("heading", { name: /welcome back/i });
  }

  get subtitle() {
    return this.screenHeader.getByText("Sign in to continue to SleekFlow");
  }

  get emailOrUsernameInput() {
    return this.page.getByRole("textbox", { name: /email or username/i });
  }

  get continueButton() {
    return this.page.getByRole("button", { name: /^continue$/i });
  }

  get googleLoginButton() {
    return this.page.getByRole("button", { name: /continue with google/i });
  }

  get appleLoginButton() {
    return this.page.getByRole("button", { name: /continue with apple/i });
  }

  get slideContainer() {
    return this.page.locator("#slide-container");
  }

  get slides() {
    return this.slideContainer.locator(".slide");
  }

  get signUpLink() {
    return this.page.getByRole("link", { name: /^sign up$/i });
  }

  get usernameValidatorEmpty() {
    return this.page.locator("#error-cs-username-required");
  }

  get passwordHeading() {
    return this.page.getByRole("heading", { name: /sign in to continue/i });
  }

  get passwordSubtitle() {
    return this.page.getByText("Fill in details to continue to SleekFlow");
  }

  get passwordInput() {
    return this.page.getByRole("textbox", { name: /^password$/i });
  }

  get signInButton() {
    return this.page.getByRole("button", { name: /^sign in$/i });
  }

  get editEmailAddressLink() {
    return this.page.getByRole("link", { name: /edit email address/i });
  }

  get resetPasswordLink() {
    return this.page.getByRole("link", { name: /reset password/i });
  }

  get keepMeSignedInCheckbox() {
    return this.page.getByRole("checkbox", { name: /keep me signed in/i });
  }

  get passwordRequiredError() {
    return this.page.locator("#error-cs-password-required");
  }

  get invalidPasswordError() {
    return this.page.locator("#error-element-password");
  }

  async expectLoginFormVisible() {
    await this.expectHeaderVisible();
    await expect(this.emailOrUsernameInput).toBeVisible();
    await expect(this.continueButton).toBeVisible();
    await expect(this.signUpLink).toBeVisible();
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

  async expectSlidesVisible() {
    await expect(this.slideContainer).toBeVisible();
    await expect(this.slides).toHaveCount(this.expectedSlides.length);

    for (const expectedSlide of this.expectedSlides) {
      const slide = this.slideContainer.locator(
        `.slide[data-slideindex="${expectedSlide.index}"]`,
      );

      await expect(slide).toBeVisible();
      await expect(slide.locator("img")).toBeVisible();
      await expect(slide.locator(".title")).toContainText(expectedSlide.title);
      await expect(slide.locator(".description")).toContainText(
        expectedSlide.description,
      );
    }
  }

  async expectPasswordFormVisible() {
    await expect(this.passwordHeading).toBeVisible();
    await expect(this.passwordSubtitle).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
    await expect(this.editEmailAddressLink).toBeVisible();
    await expect(this.resetPasswordLink).toBeVisible();
    await expect(this.keepMeSignedInCheckbox).toBeVisible();
  }

  async fillEmailOrUsername(value: string) {
    await this.emailOrUsernameInput.fill(value);
  }

  async clickContinueButton() {
    await this.continueButton.click();
  }

  async fillPassword(value: string) {
    await this.passwordInput.fill(value);
  }

  async clickSignInButton() {
    await this.signInButton.click();
  }

  async expectInboxPageOpened() {
    await expect(this.page).toHaveURL(/app\.sleekflow\.io\/.*\/inbox/, {
      timeout: 30000,
    });
  }

  async expectPasswordRequiredError() {
    await expect(this.passwordRequiredError).toHaveText(/Password is required/);
  }

  async expectInvalidPasswordError() {
    await expect(this.invalidPasswordError).toHaveText(
      /Wrong username or password/,
    );
  }

  async expectUsernameEmptyError() {
    await expect(this.usernameValidatorEmpty).toHaveText(
      /Email address or username is required/,
    );
  }
}
