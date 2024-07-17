import type { Knex } from "knex";

import { shopIds, holidayIds } from "../seed-constants";

export async function seed(knex: Knex) {
  const newYear = `${new Date().getUTCFullYear()}/12/31`;
  await knex("holidays").insert([
    {
      id: holidayIds.NewYear,
      shop_id: shopIds.Shop1,
      date: newYear,
      name: "New Year"
    }
  ]);
}
