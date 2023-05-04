import type { Knex } from "knex";

import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex) {
  await knex("orders").insert([
    { customer_id: 1, state: "draft", uuid: uuidv4(), time_slot_id: 1 },
  ]);
}
