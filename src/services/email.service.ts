import { Resend } from "resend";
import { env } from "../config/env";
import { EmailService } from "../types/services/email.service.type";

const resend = new Resend(env.email.api);

export const emailService: EmailService = {
  async send(data) {
    const { subject, html } = data;
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: env.email.to,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message);
    }
  },

  async sendEmailVerificationUrl(data) {
    const { token, email, expiresIn } = data;

    const subject = "Verify your account!";
    const html = `
    <div>
      <h2>Verify your account</h2>
      <p>Click the button below to verify your account. This link expires in ${expiresIn} hours.</p>
      <a href="${token}" style="
        background-color: #25dc56;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        display: inline-block;
      ">
        Verify your account
      </a>
      <p>If you didn't request this, ignore this email.</p>
    </div>
  `;
    await this.send({ subject, html });
  },

  async sendPasswordResetUrl(data) {
    const { token, email, expiresIn } = data;

    const subject = "Reset your password";
    const html = `
    <div>
      <h2>Reset your password</h2>
      <p>Click the button below to reset your password. This link expires in ${expiresIn} minutes.</p>
      <a href="${token}" style="
        background-color: #4F46E5;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        display: inline-block;
      ">
        Reset Password
      </a>
      <p>If you didn't request this, ignore this email.</p>
    </div>
  `;

    await this.send({ subject, html });
  },
};
