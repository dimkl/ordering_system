require('dotenv').config({ path: process.env.DOTENV_CONFIG_PATH, override: true });

const base = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: __dirname + '/../db/migrations',
    tableName: 'migrations'
  },
  seeds: {
    directory: __dirname + '/../db/seeds'
  },
  searchPath: ['public'],
  asyncStackTraces: true,
  useNullAsDefault: true
};

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: { ...base },
  production: { ...base },
  test: { 
    ...base,
    connection: 'postgresql://postgres:123456@localhost:5432/ordering_system_test'
  }
};
