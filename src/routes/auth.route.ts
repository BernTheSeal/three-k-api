import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import {
  loginSchema,
  registerSchema,
  verifiyEmailSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/validators/auth.validator";
import { isAuth } from "../middlewares/isAuth";
import passport from "../config/passport";

const authRouter = Router();

authRouter.get("/me", isAuth, authController.me);

authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.delete("/logout", authController.logout);
authRouter.post("/refresh", authController.refresh);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallback,
);

authRouter.post(
  "/verify-email/send",
  isAuth,
  authController.requestEmailVerification,
);

authRouter.post(
  "/verify-email/confirm",
  validate(verifiyEmailSchema),
  authController.verifyEmail,
);

authRouter.patch(
  "/password/change",
  isAuth,
  validate(changePasswordSchema),
  authController.changePassword,
);

authRouter.post(
  "/password/forgot",
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

authRouter.post(
  "/password/reset",
  validate(resetPasswordSchema),
  authController.resetPassword,
);

export { authRouter };
