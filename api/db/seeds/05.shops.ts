import type { Knex } from "knex";

import { userIds, shopIds } from "../seed-constants";

export async function seed(knex: Knex) {
  await knex("shops").insert([
    {
      manager_id: userIds.First,
      name: "Shop",
      id: shopIds.Shop1,
      opening_time: "08:00",
      closing_time: "00:00",
      opening_days: "{0,1,2,3,4,5}"
    }
  ]);
}
