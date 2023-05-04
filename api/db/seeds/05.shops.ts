import type { Knex } from "knex";

import { v4 as uuidv4 } from "uuid";

export async function seed(knex: Knex) {
  await knex("shops").insert([
    {
      manager_id: 1,
      name: "Shop",
      uuid: uuidv4(),
      opening_time: "08:00",
      closing_time: "00:00",
      opening_days: "{0,1,2,3,4,5}",
    },
  ]);
}
