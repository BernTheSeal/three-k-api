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

  async sendEmailVerificationCode(data) {
    const { code, email, expiresIn } = data;

    const subject = "Your verification code is here!";
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
      <h2>Email Verification</h2>
      <p>Your verification code:</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px; background: #f4f4f4; text-align: center; border-radius: 8px;">
        ${code}
      </div>
      <p style="color: #888; font-size: 12px;">This code expires in ${expiresIn} minutes.</p>
    </div>
  `;
    await this.send({ subject, html });
  },
};
