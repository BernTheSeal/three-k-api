import { envConfig } from "./env.config";

export const authConfig = {
  jwt: {
    secret: envConfig.jwtSecret,
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
    clientId: envConfig.google.clientId,
    clientSecret: envConfig.google.clientSecret,
    callbackUrl: envConfig.google.callbackUrl,
  },
} as const;
