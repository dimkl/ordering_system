import type { Knex } from "knex";

import { userIds, sectionIds, slotIds } from "../seed-constants";

export async function seed(knex: Knex) {
  await knex("slots").insert([
    {
      section_id: sectionIds.Section1,
      user_id: userIds.First,
      sku: "table-1",
      id: slotIds.Table1,
      active: true,
      capacity: 5
    }
  ]);
}
