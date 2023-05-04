import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.alterTable("products", function (table) {
    table.integer("category_id").unsigned();

    table.foreign("category_id").references("categories.id");
  });
}

export function down(knex: Knex) {
  return knex.schema.alterTable("products", function (table) {
    table.dropColumn("category_id");
  });
}
