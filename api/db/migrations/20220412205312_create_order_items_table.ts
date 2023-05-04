import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("order_items", function (table) {
    table.increments("id");
    table.timestamps(true, true);
    table.integer("order_id").unsigned();
    table.integer("product_id").unsigned();
    table.integer("quantity").unsigned();
    table.string("state", 50).notNullable().defaultTo("draft");

    table.foreign("order_id").references("orders.id");
    table.foreign("product_id").references("products.id");

    table.unique(["order_id", "product_id"]);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("order_items");
}
