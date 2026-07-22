import { env } from "./env.config";

export const authConfig = {
  jwt: {
    secret: env.jwtSecret,
    accessTokenExpiresIn: "15m",
  },

  token: {
    refresh: {
      cookieName: "refreshToken",
      byteLength: 64,
      expiresInDays: 14,
    },
    verifyEmail: {
      byteLength: 32,
      expiresInHours: 24,
    },
    resetPassword: {
      byteLength: 64,
      expiresInHours: 1,
    },
  },

  password: {
    saltRounds: 12,
  },

  google: {
    clientId: env.google.clientId,
    clientSecret: env.google.clientSecret,
    callbackUrl: env.google.callbackUrl,
  },
} as const;
