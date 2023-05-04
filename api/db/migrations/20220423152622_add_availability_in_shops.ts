import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.alterTable("shops", function (table) {
    table.time("opening_time");
    table.time("closing_time");
    table.specificType("opening_days", "jsonb[]");
  });
}

export function down(knex: Knex) {
  return knex.schema.alterTable("shops", function (table) {
    table.dropColumn("opening_time");
    table.dropColumn("closing_time");
    table.dropColumn("opening_days");
  });
}
