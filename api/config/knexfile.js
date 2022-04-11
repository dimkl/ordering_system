require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH, override: true });

const base = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: '../db/migrations',
    tableName: 'migrations'
  },
  seeds: {
    directory: '../db/seeds'
  },
  searchPath: ['public'],
  asyncStackTraces: true
};

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: { ...base },
  production: { ...base },
  test: { ...base }
};
