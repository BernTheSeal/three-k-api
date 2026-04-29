import { PoolClient } from "pg";

const migration = {
  version: 3,

  up: async (client: PoolClient) => {
    await client.query(`
        CREATE TABLE IF NOT EXISTS word_phonetics (
            word_id integer REFERENCES words(word_id),
            locale varchar NOT NULL,
            "text" varchar NOT NULL,
            mp3 varchar NOT NULL,
            PRIMARY KEY (word_id, locale)
        );
        CREATE TABLE IF NOT EXISTS word_pos_levels (
            word_id integer REFERENCES words(word_id),
            pos_id integer REFERENCES pos(pos_id),
            level_id integer REFERENCES levels(level_id),
            PRIMARY KEY (word_id, pos_id, level_id)
        );
    `);
  },

  down: async (client: PoolClient) => {
    await client.query(`
        DROP TABLE IF EXISTS word_phonetics CASCADE;
        DROP TABLE IF EXISTS word_pos_levels CASCADE;
    `);
  },
};

export default migration;
