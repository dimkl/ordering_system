import type { Knex } from "knex";

import { productIds, shopIds, productAvailabilityIds } from "../seed-constants";

export async function seed(knex: Knex) {
  await knex("product_availability").insert([
    {
      id: productAvailabilityIds.Product1Shop1,
      shop_id: shopIds.Shop1,
      product_id: productIds.Product1,
      quantity: 2
    }
  ]);
}
