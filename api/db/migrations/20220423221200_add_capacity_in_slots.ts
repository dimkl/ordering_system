import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.alterTable("slots", function (table) {
    table.integer("capacity").unsigned().notNullable();
  });
}

export function down(knex: Knex) {
  return knex.schema.alterTable("slots", function (table) {
    table.dropColumn("capacity");
  });
}
