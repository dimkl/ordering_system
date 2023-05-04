import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("products", function (table) {
    table.increments("id");
    table.timestamps(true, true);
    table.string("title", 255).notNullable();
    table.string("description", 255);
    table.string("qr", 255);
    table.string("sku", 100);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("products");
}
