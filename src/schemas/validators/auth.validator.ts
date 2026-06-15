import z from "zod";

import { stringSchema, emailSchema } from "../builders";

export const registerSchema = z.object({
  body: z.object({
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

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema(),
    password: stringSchema("password", { max: 255 }),
  }),
});

export const verifiyEmailSchema = z.object({
  body: z.object({
    token: stringSchema("token", { min: 1 }),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
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

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
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

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type VerifyEmailDto = z.infer<typeof verifiyEmailSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordDto = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
