export const unknownError = "An unknown error occurred. Please try again later!";

export const redirects = {
  toLogin: "/signin",
  toSignup: "/signup",
  afterLogin: "/",
  afterLogout: "/",
  toVerify: "/verify-email",
  afterVerify: "/"
} as const;
