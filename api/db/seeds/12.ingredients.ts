import type { Knex } from "knex";

import { ingredientIds, shopIds } from "../seed-constants";

export async function seed(knex: Knex) {
  await knex("ingredients").insert([
    {
      title: "Ingredient 1",
      description: "Ingredient 1 description",
      id: ingredientIds.Ingredient1,
      shop_id: shopIds.Shop1
    }
  ]);
}
