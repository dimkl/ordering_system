import type { Knex } from "knex";

import { ingredientIds, productIds, productIngredientIds } from "../seed-constants";

export async function seed(knex: Knex) {
  await knex("product_ingredients").insert([
    {
      id: productIngredientIds.Product1Ingredient1,
      product_id: productIds.Product1,
      ingredient_id: ingredientIds.Ingredient1
    }
  ]);
}
