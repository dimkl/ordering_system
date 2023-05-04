import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.alterTable("orders", function (table) {
    table.integer("time_slot_id").unsigned().notNullable();

    table.foreign("time_slot_id").references("time_slots.id");
    table.unique(["time_slot_id"]);
  });
}

export function down(knex: Knex) {
  return knex.schema.alterTable("orders", function (table) {
    table.dropColumn("time_slot_id");
  });
}
