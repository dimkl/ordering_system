import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

const base = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: __dirname + "/../db/migrations",
    tableName: "migrations"
  },
  seeds: {
    directory: __dirname + "/../db/seeds"
  },
  searchPath: ["public"],
  asyncStackTraces: true,
  useNullAsDefault: true
};

export const development = { ...base };

export const production = { ...base };

export const test = { ...base };

export default {
  development,
  production,
  test
};
