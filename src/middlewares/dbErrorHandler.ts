import { DatabaseError } from "pg";
import { NotFoundError, ConflictError } from "../errors";
import { AppError } from "../errors/AppError";
import { ErrorRequestHandler } from "express";

const dbErrorMapper: Record<string, () => AppError> = {
  uq_users_email: () =>
    new ConflictError("Email already exists", "EMAIL_ALREADY_EXISTS"),
  uq_users_username: () =>
    new ConflictError("Username already exists", "USERNAME_ALREADY_EXISTS"),
  uq_users_google_id: () =>
    new ConflictError(
      "Google account already linked",
      "GOOGLE_ID_ALREADY_EXISTS",
    ),
  fk_user_words_word: () =>
    new NotFoundError("Word not found", "WORD_NOT_FOUND"),
  fk_user_words_user: () =>
    new NotFoundError("User not found", "USER_NOT_FOUND"),
  pk_user_words: () =>
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
