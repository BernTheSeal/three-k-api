import { getExecutor, getLock } from "../lib/db";
import { WordRepo } from "../types/repositories/word.repo.type";
import {
  ListResult,
  findByWordResult,
} from "../types/repositories/word.repo.type";

export const wordRepo: WordRepo = {
  async list(data, tx) {
    const { offset, limit } = data.paginate;
    const { search, pos, level, status, is_favorite, mode } = data.filters;
    const user_id = data.user_id;

    const executor = getExecutor<ListResult>(tx?.client);
    const lock = getLock(tx?.lock);

    const joinType = mode == "mine" ? "INNER" : "LEFT";

    const conditions: string[] = [];
    const params: unknown[] = [offset, limit, user_id];

    if (search) {
      params.push(search);
      conditions.push(`word ILIKE '%' || $${params.length} || '%'`);
    }

    if (pos && pos.length > 0) {
      params.push(pos);
      conditions.push(`pos && $${params.length}::varchar[]`);
    }

    if (level && level.length > 0) {
      params.push(level);
      conditions.push(`levels && $${params.length}::varchar[]`);
    }

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (is_favorite != undefined) {
      params.push(is_favorite);
      conditions.push(`is_favorite = $${params.length}`);
    }

    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const response = await executor(
      `
        SELECT *, COUNT(*) OVER()::int AS total_words FROM (
            SELECT 
                w.word_id,
                w.word, 
                array_agg(DISTINCT p.pos) AS pos, 
                array_agg(DISTINCT l.level) AS levels,
                uw.status, 
                uw.is_favorite
            FROM words w
            JOIN word_pos_levels wpl ON w.word_id = wpl.word_id
            JOIN pos p ON p.pos_id = wpl.pos_id
            JOIN levels l ON l.level_id = wpl.level_id
            ${joinType} JOIN user_words uw ON uw.word_id = w.word_id AND uw.user_id = $3
            GROUP BY w.word_id, w.word, uw.status, uw.is_favorite
        )
        ${where}
        OFFSET $1 LIMIT $2
        ${lock}
    `,
      params,
    );

    return response.rows;
  },

  async findByWord(data, tx) {
    const { word, user_id } = data;

    const executor = getExecutor<findByWordResult>(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
        SELECT 
          w.word_id,
          w.word,
          p.pos,
          l.level,
          wp.*,
          uw.status,
          uw.note, 
          uw.is_favorite
        FROM words w
        JOIN word_pos_levels wpl ON w.word_id = wpl.word_id
        JOIN pos p ON p.pos_id  = wpl.pos_id
        JOIN levels l ON l.level_id  = wpl.level_id
        JOIN word_phonetics wp ON wp.word_id = w.word_id
        LEFT JOIN user_words uw ON uw.user_id = $2 AND uw.word_id = w.word_id  
        WHERE w.word = $1 
        ${lock}`,

      [word, user_id],
    );

    return response.rows;
  },
};
