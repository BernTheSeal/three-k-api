import { PoolClient } from "pg";

const migration = {
  version: 11,

  up: async (client: PoolClient) => {
    await client.query(`
        CREATE TABLE sentence_words (
            sentence_id INTEGER NOT NULL REFERENCES sentences(sentence_id) ON DELETE CASCADE,
            word_id INTEGER REFERENCES words(word_id),
            pos_id INTEGER NOT NULL REFERENCES pos(pos_id),
            surface_form TEXT NOT NULL, 
            position INTEGER NOT NULL,
            is_merge_prev BOOLEAN NOT NULL,
            is_capitalize BOOLEAN NOT NULL,
            is_punc BOOLEAN NOT NULL,

            PRIMARY KEY (sentence_id, position),
            CHECK (word_id IS NOT NULL OR is_punc)
        );
        
        CREATE INDEX idx_sentence_words_word_id_sentence_id
        ON sentence_words (word_id, sentence_id)
        WHERE word_id IS NOT NULL;
    `);
  },

  down: async (client: PoolClient) => {
    await client.query(`
        DROP TABLE IF EXISTS sentence_words;
    `);
  },
};

export default migration;
