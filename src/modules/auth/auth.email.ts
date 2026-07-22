import { sendMail } from "@/shared/lib/email.lib";
import { authConfig } from "@/shared/config/auth.config";

const sendEmailVerificationUrl = async (data: { token: string; email: string }) => {
  const { token, email } = data;

  const subject = "Verify your account!";
  const html = `
    <div>
      <h2>Verify your account</h2>
      <p>Click the button below to verify your account. This link expires in ${authConfig.token.resetPassword.expiresInHours} hours.</p>
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
  sendMail({ subject, html });
};

const sendPasswordResetUrl = async (data: { token: string; email: string }) => {
  const { token, email } = data;

  const subject = "Reset your password";
  const html = `
    <div>
      <h2>Reset your password</h2>
      <p>Click the button below to reset your password. This link expires in ${authConfig.token.resetPassword.expiresInHours} hours.</p>
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

  await sendMail({ subject, html });
};

export { sendEmailVerificationUrl, sendPasswordResetUrl };
