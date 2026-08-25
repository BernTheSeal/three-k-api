import { PoolClient } from "pg";

const migration = {
  version: 11,

  up: async (client: PoolClient) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS sentence_words (
            sentence_word_id SERIAL PRIMARY KEY,
            sentence_id INTEGER NOT NULL REFERENCES sentences(sentence_id),
            word_id INTEGER NOT NULL REFERENCES words(word_id),
            surface_form TEXT NOT NULL 
        );
                
        CREATE INDEX idx_sentence_words_sentence_id ON sentence_words(sentence_id);
        CREATE INDEX idx_sentence_words_word_id ON sentence_words(word_id);
    `);
  },

  down: async (client: PoolClient) => {
    await client.query(`
        DROP INDEX IF EXISTS idx_sentence_words_word_id;
        DROP INDEX IF EXISTS idx_sentence_words_sentence_id;
        DROP TABLE IF EXISTS sentence_words;
    `);
  },
};

export default migration;
