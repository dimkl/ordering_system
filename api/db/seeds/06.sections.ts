import type { Knex } from "knex";

import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex) {
  await knex("sections").insert([
    {
      shop_id: 1,
      user_id: 1,
      name: "Section",
      sku: "section-1",
      uuid: uuidv4()
    }
  ]);
}
