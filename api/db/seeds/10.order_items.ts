import type { Knex } from "knex";

import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex) {
  await knex("order_items").insert([
    { order_id: 1, product_id: 1, state: "draft", uuid: uuidv4() }
  ]);
}
