export type EmailService = {
  send: (data: { subject: string; html: string }) => Promise<void>;

  sendEmailVerificationUrl: (data: { email: string; token: string; expiresIn: number }) => Promise<void>;

  sendPasswordResetUrl: (data: { token: string; email: string; expiresIn: number }) => Promise<void>;
};
