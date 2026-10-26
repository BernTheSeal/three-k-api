import { Resend } from "resend";
import { emailConfig } from "@/shared/config/email.config";

export const resend = new Resend(emailConfig.api);
