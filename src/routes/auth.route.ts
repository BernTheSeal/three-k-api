import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import {
  loginSchema,
  registerSchema,
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

export { authRouter };
