import { Router } from "express";
import { authController } from "./auth.controller";
import { validate } from "@/shared/middlewares/validate";
import {
  loginSchema,
  registerSchema,
  verifiyEmailSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validator";
import { authenticate } from "@/shared/middlewares/authenticate";

import passport from "./auth.strategy";

const authRouter = Router();

authRouter.get("/me", authenticate, authController.me);

authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.delete("/logout", authController.logout);
authRouter.post("/refresh", authController.refresh);

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get("/google/callback", passport.authenticate("google", { session: false }), authController.googleCallback);

authRouter.post("/verify-email/send", authenticate, authController.requestEmailVerification);

authRouter.post("/verify-email/confirm", validate(verifiyEmailSchema), authController.verifyEmail);

authRouter.patch("/password/change", authenticate, validate(changePasswordSchema), authController.changePassword);

authRouter.post("/password/forgot", validate(forgotPasswordSchema), authController.forgotPassword);

authRouter.post("/password/reset", validate(resetPasswordSchema), authController.resetPassword);

export { authRouter };
