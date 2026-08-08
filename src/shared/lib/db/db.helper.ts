import { DatabaseError } from "pg";
import { ConflictError, InternalServerError, NotFoundError } from "@/shared/errors";

export const errorMapper = (error: DatabaseError): ConflictError | InternalServerError | NotFoundError => {
  switch (error.constraint) {
    case "uq_users_username":
      return new ConflictError("Username already exists!", "USERNAME_ALREADY_EXISTS");

    case "idx_one_active_token":
      return new ConflictError("token is already active!", "TOKEN_ALREADY_ACTIVE");

    case "uq_auth_provider_account":
      return new ConflictError("Account already exists!", "ACCOUNT_ALREADY_EXISTS");

    case "uq_auth_user_provider":
      return new ConflictError("Provider already linked!", "PROVIDER_ALREADY_LINKED");

    case "uq_auth_email_provider":
      return new ConflictError("Email already linked to another account.", "EMAIL_ALREADY_LINKED");

    case "pk_user_words":
      return new ConflictError("Word already saved", "USER_WORD_ALREADY_EXISTS ");

    case "fk_user_words_user":
      return new NotFoundError("User not found", "USER_NOT_FOUND");

    case "fk_user_words_word":
      return new NotFoundError("Word not found", "WORD_NOT_FOUND");

    default:
      return new InternalServerError(`Unmapped database constraint => ${error.constraint}`, "UNMAPPED_DB_CONSTRAINT");
  }
};
