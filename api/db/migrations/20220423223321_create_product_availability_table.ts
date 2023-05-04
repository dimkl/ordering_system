import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("product_availability", function (table) {
    table.increments("id");
    table.timestamps(true, true);
    table.integer("quantity").unsigned().notNullable().defaultTo(0);
    table.integer("shop_id").unsigned().notNullable();
    table.integer("product_id").unsigned().notNullable();

    table.foreign("shop_id").references("shops.id");
    table.foreign("product_id").references("products.id");
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("product_availability");
}
