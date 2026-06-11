function getEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const testUsers = {
  invalidEmail: "invalid-email",
  validLoginEmail: getEnv("LOGIN_EMAIL"),
  validLoginPassword: getEnv("LOGIN_PASSWORD"),
  invalidLoginPassword: getEnv("INVALID_LOGIN_PASSWORD"),
};

export const signupPasswords = {
  validPassword: getEnv("SIGNUP_VALID_PASSWORD"),
  weakPassword: getEnv("SIGNUP_WEAK_PASSWORD"),
};

export function generateSignupEmail() {
  return `${Date.now()}-sleekflow@yopmail.com`;
}
