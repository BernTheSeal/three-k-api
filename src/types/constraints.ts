export const constraints = {
  user: {
    uq_username: "uq_users_username",
  } as const,
  authAccounts: {
    uq_provider_account: "uq_auth_provider_account",
    uq_user_provider: "uq_auth_user_provider",
  } as const,
  userWords: {
    pk: "pk_user_words",
    fk_user: "fk_user_words_user",
    fk_word: "fk_user_words_word",
  } as const,
};
