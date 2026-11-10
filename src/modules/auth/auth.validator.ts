import { stringSchema, emailSchema, objectSchema, GetInfer } from "@/shared/lib/validate";

export const registerSchema = objectSchema("register", {
  body: objectSchema("body", {
    username: stringSchema("username", { min: 3, max: 50 }),
    email: emailSchema(),
    password: stringSchema("password", {
      min: 8,
      max: 255,
      requireLowercase: true,
      requireNumber: true,
      requireUppercase: true,
    }),
  }),
});

export const loginSchema = objectSchema("login", {
  body: objectSchema("body", {
    email: emailSchema(),
    password: stringSchema("password", { max: 255 }),
  }),
});

export const verifyEmailSchema = objectSchema("verify email", {
  body: objectSchema("body", {
    token: stringSchema("token", { min: 1 }),
  }),
});

export const changePasswordSchema = objectSchema("change password", {
  body: objectSchema("body", {
    currentPassword: stringSchema("password", { min: 1, max: 255 }),
    newPassword: stringSchema("new password", {
      min: 8,
      max: 255,
      requireLowercase: true,
      requireNumber: true,
      requireUppercase: true,
    }),
    newPasswordConfirm: stringSchema("new password confirm", {
      min: 8,
    }),
  }),
});

export const forgotPasswordSchema = objectSchema("forgot password", {
  body: objectSchema("body", {
    email: emailSchema(),
  }),
});

export const resetPasswordSchema = objectSchema("reset password", {
  body: objectSchema("body", {
    token: stringSchema("token", { min: 1 }),
    newPassword: stringSchema("new password", {
      min: 8,
      max: 255,
      requireLowercase: true,
      requireNumber: true,
      requireUppercase: true,
    }),
    newPasswordConfirm: stringSchema("new password confirm", { min: 1 }),
  }),
});

export type RegisterDto = GetInfer<typeof registerSchema>;
export type LoginDto = GetInfer<typeof loginSchema>;
export type VerifyEmailDto = GetInfer<typeof verifyEmailSchema>;
export type ChangePasswordDto = GetInfer<typeof changePasswordSchema>;
export type ForgotPasswordDto = GetInfer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = GetInfer<typeof resetPasswordSchema>;
