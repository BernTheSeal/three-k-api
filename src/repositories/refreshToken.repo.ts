import { RefreshTokenRepo } from "../types/repositories/refreshToken.repo.type";
import { getExecutor, getLock } from "../lib/db";
import { RefreshToken } from "../types/entities";

export const refreshTokenRepo: RefreshTokenRepo = {
  async create(data, tx) {
    const { token_hash, user_id, family_id, expires_at } = data;

    const executor = getExecutor<RefreshToken>(tx?.client);

    const response = await executor(
      `INSERT INTO refresh_tokens (token_hash, user_id, family_id, expires_at)
        VALUES($1, $2, $3, $4)
        `,
      [token_hash, user_id, family_id, expires_at],
    );

    return response.rows[0]!;
  },

  async findByToken(data, tx) {
    const { token_hash } = data;

    const executor = getExecutor<RefreshToken>(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
      SELECT * FROM refresh_tokens
      WHERE token_hash = $1
      ${lock}
    `,
      [token_hash],
    );

    return response.rows[0];
  },

  async revoke(data, tx) {
    const { by, reason } = data;

    const executor = getExecutor(tx?.client);

    if ("token_hash" in by) {
      await executor(
        `UPDATE refresh_tokens
       SET is_revoked = true, revoked_reason = $1, revoked_at = NOW()
       WHERE token_hash = $2`,
        [reason, by.token_hash],
      );
    } else if ("family_id" in by) {
      await executor(
        `UPDATE refresh_tokens
       SET is_revoked = true, revoked_reason = $1, revoked_at = NOW()
       WHERE family_id = $2 AND is_revoked = false`,
        [reason, by.family_id],
      );
    } else if ("user_id" in by) {
      await executor(
        `UPDATE refresh_tokens
       SET is_revoked = true, revoked_reason = $1, revoked_at = NOW()
       WHERE user_id = $2 AND is_revoked = false`,
        [reason, by.user_id],
      );
    }
  },
};
