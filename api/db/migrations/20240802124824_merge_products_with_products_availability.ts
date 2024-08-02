import type { Knex } from "knex";

export async function up(knex: Knex) {
  await knex.schema.alterTable("products", function (table) {
    table.string("shop_id").unsigned();
    table.foreign("shop_id").references("shops.id");

    table.integer("quantity").unsigned().defaultTo(1).notNullable();
  });

  await knex("products")
    .update({
      shop_id: knex.ref("product_availability.shop_id"),
      quantity: knex.ref("product_availability.quantity")
    })
    .updateFrom("product_availability")
    .where({ "product_availability.product_id": knex.ref("products.id") });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable("products", (t) => {
    t.dropForeign("shop_id");
  });

  await knex.schema.alterTable("products", function (table) {
    table.dropColumn("shop_id");
    table.dropColumn("quantity");
  });
}
