import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("time_slots", function (table) {
    table.increments("id");
    table.timestamps(true, true);
    table.uuid("uuid").notNullable();
    table.timestamp("started_at").notNullable();
    table.timestamp("ended_at");
    table.integer("slot_id").unsigned();
    table.integer("customer_id").unsigned();

    table.foreign("slot_id").references("slots.id");
    table.foreign("customer_id").references("customers.id");
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("time_slots");
}
