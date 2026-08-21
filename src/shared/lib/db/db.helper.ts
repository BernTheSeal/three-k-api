import { DatabaseError } from "pg";
import { ConflictError, InternalServerError, NotFoundError } from "@/shared/errors";

export const errorMapper = (error: DatabaseError): ConflictError | InternalServerError | NotFoundError => {
  if (error.code === "23505" || error.code === "23503") {
    switch (error.constraint) {
      case "uq_users_username":
        return new ConflictError({ message: "Username already exists!", code: "USERNAME_ALREADY_EXISTS" });

      case "idx_one_active_token":
        return new ConflictError({ message: "token is already active!", code: "TOKEN_ALREADY_ACTIVE" });

      case "uq_auth_provider_account":
        return new ConflictError({ message: "Account already exists!", code: "ACCOUNT_ALREADY_EXISTS" });

      case "uq_auth_user_provider":
        return new ConflictError({ message: "Provider already linked!", code: "PROVIDER_ALREADY_LINKED" });

      case "uq_auth_email_provider":
        return new ConflictError({ message: "Email already linked to another account.", code: "EMAIL_ALREADY_LINKED" });

      case "pk_user_words":
        return new ConflictError({ message: "Word already saved", code: "USER_WORD_ALREADY_EXISTS" });

      case "fk_user_words_user":
        return new NotFoundError({ message: "User not found", code: "USER_NOT_FOUND" });

      case "fk_user_words_word":
        return new NotFoundError({ message: "Word not found", code: "WORD_NOT_FOUND" });

      default:
        return new InternalServerError({
          message: `Unmapped constraint => ${error.constraint}`,
          code: "UNMAPPED_DB_CONSTRAINT",
        });
    }
  }

  if (error.code === "22P02") {
    return new InternalServerError({
      message: "Invalid data reached the database layer — validation likely bypassed.",
      code: "DB_TYPE_MISMATCH",
    });
  }

  return new InternalServerError({
    message: `Unmapped database error => ${error.message}`,
    code: "UNMAPPED_DB_ERROR",
  });
};

export const toCamelCase = <T extends Record<string, unknown>>(rows: Record<string, unknown>[]): T[] => {
  const first = rows[0];

  if (!first) {
    return rows as T[];
  }

  const rowKeys = Object.keys(first);
  const keysMap = new Map<string, string>();

  for (const key of rowKeys) {
    const camelCase = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    keysMap.set(key, camelCase);
  }

  return rows.map((v) => {
    const newObj: Record<string, unknown> = {};

    for (const key of rowKeys) {
      const camelCaseKey = keysMap.get(key) ?? key;
      newObj[camelCaseKey] = v[key];
    }

    return newObj;
  }) as T[];
};
