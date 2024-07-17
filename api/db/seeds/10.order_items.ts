import type { Knex } from "knex";

import { orderIds, orderItemIds, productIds } from "../seed-constants";

export async function seed(knex: Knex) {
  await knex("order_items").insert([
    {
      order_id: orderIds.Draft,
      product_id: productIds.Product1,
      state: "draft",
      id: orderItemIds.Item1
    }
  ]);
}
