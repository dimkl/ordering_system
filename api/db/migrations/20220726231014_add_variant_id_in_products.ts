import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.alterTable("products", function (table) {
    table.integer("variant_id").unsigned();

    table.foreign("variant_id").references("products.id");
  });
}

export function down(knex: Knex) {
  return knex.schema.alterTable("products", function (table) {
    table.dropColumn("variant_id");
  });
}
