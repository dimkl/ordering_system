import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.alterTable("order_items", function (table) {
    table.text("comments").nullable();
  });
}

export function down(knex: Knex) {
  return knex.schema.alterTable("order_items", function (table) {
    table.dropColumn("comments");
  });
}
