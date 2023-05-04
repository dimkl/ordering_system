import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("orders", function (table) {
    table.increments("id");
    table.integer("customer_id").unsigned();
    table.string("state", 50).notNullable().defaultTo("draft");
    table.timestamps(true, true);

    table.foreign("customer_id").references("customers.id");
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("orders");
}
