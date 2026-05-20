import { AuthAccount } from "../entities";
import { User } from "../entities/user";
import { Profile } from "passport-google-oauth20";

export type EmailService = {
  send: (data: { subject: string; html: string }) => Promise<void>;

  sendEmailVerificationCode: (data: {
    email: string;
    code: string;
    expiresIn: number;
  }) => Promise<void>;
};
