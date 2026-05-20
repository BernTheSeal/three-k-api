const requiredEnvs = [
  "PORT",
  "NODE_ENV",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "DB_HOST",
  "DB_PORT",
  "JWT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "RESEND_API_KEY",
  "RESEND_TO_EMAIL",
];

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`Missing environment variable: ${env}`);
  }
});

export const env = {
  port: process.env.PORT!,
  nodeEnv: process.env.NODE_ENV!,
  db: {
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    name: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    port: process.env.DB_PORT!,
  },
  jwtSecret: process.env.JWT_SECRET!,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL!,
  },
  email: {
    api: process.env.RESEND_API_KEY!,
    to: process.env.RESEND_TO_EMAIL!,
  },
};
