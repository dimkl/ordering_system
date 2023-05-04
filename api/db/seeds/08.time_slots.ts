import type { Knex } from "knex";

import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex) {
  const now = Date.now();

  await knex("time_slots").insert([
    {
      slot_id: 1,
      customer_id: 1,
      uuid: uuidv4(),
      started_at: new Date(now),
      ended_at: new Date(now + 3600000),
    },
  ]);
}
