import { DatabaseError } from "pg";
import { NotFoundError, ConflictError } from "../errors";
import { AppError } from "../errors/AppError";
import { ErrorRequestHandler } from "express";

import { constraints } from "../types/constraints";

const dbErrorMapper: Record<string, () => AppError> = {
  [constraints.users.uq_username]: () =>
    new ConflictError("Username already exists!", "USERNAME_ALREADY_EXISTS"),
  [constraints.verificationTokens.uq_one_active_token]: () =>
    new ConflictError(
      "Verification token is already active!",
      "VERIFICATION_TOKEN_ACTIVE",
    ),
  [constraints.userWords.fk_word]: () =>
    new NotFoundError("Word not found", "WORD_NOT_FOUND"),
  [constraints.authAccounts.uq_provider_account]: () =>
    new ConflictError("Account already exists!", "ACCOUNT_ALREADY_EXISTS"),

  [constraints.authAccounts.uq_user_provider]: () =>
    new ConflictError("Provider already linked!", "PROVIDER_ALREADY_LINKED"),

  [constraints.authAccounts.uq_email_provider]: () =>
    new ConflictError(
      "Email already linked to another account.",
      "EMAIL_ALREADY_LINKED",
    ),

  [constraints.userWords.fk_user]: () =>
    new NotFoundError("User not found", "USER_NOT_FOUND"),

  [constraints.userWords.pk]: () =>
    new ConflictError("Word already saved", "WORD_ALREADY_SAVED"),
};

export const dbErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof DatabaseError) {
    if (err.constraint) {
      const mapper = dbErrorMapper[err.constraint];
      if (mapper) {
        return next(mapper());
      }
      console.warn("Unmapped DB error:", err.constraint, err.message);
    }
  }
  next(err);
};
