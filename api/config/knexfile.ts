import dotenv from "dotenv";
dotenv.config({ path: process.env.DOTENV_CONFIG_PATH, override: true });

const base = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: __dirname + "/../dist/db/migrations",
    tableName: "migrations",
  },
  seeds: {
    directory: __dirname + "/../dist/db/seeds",
  },
  searchPath: ["public"],
  asyncStackTraces: true,
  useNullAsDefault: true,
};

export const development = { ...base };

export const production = { ...base };

export const test = {
  ...base,
  connection:
    "postgresql://postgres:123456@localhost:5432/ordering_system_test",
};

export default {
  development,
  production,
  test,
};
