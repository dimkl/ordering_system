import type { Knex } from "knex";

import { categoriIds, productIds, shopIds } from "../seed-constants";

export async function seed(knex: Knex) {
  await knex("products").insert([
    {
      title: "Product",
      sku: "product-code-1",
      description: "Product description",
      id: productIds.Product1,
      category_id: categoriIds.Starters,
      shop_id: shopIds.Shop1,
      quantity: 2
    },
    {
      title: "Product (variant 1)",
      sku: "product-code-1-1",
      description: "Product variant 1 description",
      id: productIds.Variant1,
      variant_id: productIds.Product1,
      category_id: categoriIds.Starters,
      shop_id: shopIds.Shop1,
      quantity: 0
    },
    {
      title: "Product (variant 2)",
      sku: "product-code-1-2",
      description: "Product variant 2 description",
      id: productIds.Variant2,
      variant_id: productIds.Product1,
      shop_id: shopIds.Shop1,
      quantity: 0
    }
  ]);
}
