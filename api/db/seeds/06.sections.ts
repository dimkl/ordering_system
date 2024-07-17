import type { Knex } from "knex";

import { userIds, shopIds, sectionIds } from "../seed-constants";

export async function seed(knex: Knex) {
  await knex("sections").insert([
    {
      shop_id: shopIds.Shop1,
      user_id: userIds.First,
      name: "Section",
      sku: "section-1",
      id: sectionIds.Section1
    }
  ]);
}
