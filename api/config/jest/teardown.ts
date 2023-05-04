import { knex } from "../../src/shared/knex";

export default async () => {
  await knex.destroy();
};
