import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("customers", function (table) {
    table.increments("id");
    table.string("first_name", 255).notNullable();
    table.string("last_name", 255).notNullable();
    table.string("email", 255).unique();
    table.string("password", 255).notNullable();
    table.timestamps(true, true);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("customers");
}
