import { getExecutor, getLock } from "@/shared/lib/db.lib";
import { WordRepo } from "@/shared/types/repositories/word.repo.type";
import { ListResult, FindByWordResult } from "@/shared/types/repositories/word.repo.type";

export const wordRepo: WordRepo = {
  async list(data, tx) {
    const { offset, limit } = data.paginate;
    const { search, pos, level } = data.filters;

    const executor = getExecutor(tx?.client);

    const conditions: string[] = [];
    const params: unknown[] = [offset, limit];

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

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const response = await executor(
      `
      WITH enriched_words AS (
        SELECT 
          w.word_id,
          w.word,
          array_agg(DISTINCT p.pos) AS pos, 
          array_agg(DISTINCT l.level) AS levels
        FROM words w
        JOIN word_pos_levels wpl ON w.word_id = wpl.word_id
        JOIN pos p ON p.pos_id = wpl.pos_id
        JOIN levels l ON l.level_id = wpl.level_id
        GROUP BY w.word_id, w.word
      ),

      filtered_words AS (
        SELECT 
          *, 
          COUNT(*) OVER()::int total_words 
        FROM enriched_words
        ${where}
      ),

      paginate_words AS (
        SELECT * FROM filtered_words
        ORDER BY word
        OFFSET $1 LIMIT $2
      )

      SELECT * FROM paginate_words 
    `,
      params,
    );

    return response.rows as ListResult[];
  },

  async findByWord(data, tx) {
    const { word } = data;

    const executor = getExecutor(tx?.client);
    const lock = getLock(tx?.lock);

    const response = await executor(
      `
        SELECT 
          w.word_id,
          w.word,
          p.pos,
          l.level,
          wp.*
        FROM words w
        JOIN word_pos_levels wpl ON w.word_id = wpl.word_id
        JOIN pos p ON p.pos_id  = wpl.pos_id
        JOIN levels l ON l.level_id  = wpl.level_id
        JOIN word_phonetics wp ON wp.word_id = w.word_id
        WHERE w.word = $1 
        ${lock}`,

      [word],
    );

    return response.rows as FindByWordResult[];
  },
};
