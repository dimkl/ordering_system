import type { Knex } from "knex";

import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex) {
  await knex("slots").insert([
    {
      section_id: 1,
      user_id: 1,
      sku: "table-1",
      uuid: uuidv4(),
      active: true,
      capacity: 5,
    },
  ]);
}
