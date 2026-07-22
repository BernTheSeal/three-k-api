import { Resend } from "resend";
import { emailConfig } from "@/shared/config/email.config";
import { ExternalServiceError } from "../errors";
import { HTTP_STATUS } from "../constants/httpStatus.const";

const resend = new Resend(emailConfig.api);

export const sendMail = async (data: { subject: string; html: string }) => {
  for (let i = 1; i <= emailConfig.maxAttempt; i++) {
    try {
      const { subject, html } = data;

      const { error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: emailConfig.to,
        subject,
        html,
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error(err);

      const statusCode = err?.statusCode || err?.status;

      const shouldRetry = !statusCode || statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR || statusCode == HTTP_STATUS.TOO_MANY_REQUESTS;

      if (shouldRetry && i < emailConfig.maxAttempt) {
        await new Promise((resolve) => setTimeout(resolve, i * emailConfig.retryDelayMs));
        continue;
      }

      throw new ExternalServiceError("Failed to send email. Please try again later.", HTTP_STATUS.BAD_GATEWAY, "email", err);
    }
  }
};
