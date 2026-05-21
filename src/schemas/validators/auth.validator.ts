import z from "zod";

import { stringSchema } from "../builders";

export const registerSchema = z.object({
  body: z.object({
    username: stringSchema("username", { min: 3, max: 50 }),
    email: z.email("Invalid email."),
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
    email: z.email("Invalid email."),
    password: stringSchema("password", { max: 255 }),
  }),
});

export const verifiyEmailSchema = z.object({
  body: z.object({
    code: stringSchema("code", { min: 1, max: 6 }),
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

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
export type VerifyEmailDto = z.infer<typeof verifiyEmailSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
