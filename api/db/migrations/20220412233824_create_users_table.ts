import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id");
    table.timestamps(true, true);
    table.string("first_name", 255).notNullable();
    table.string("last_name", 255).notNullable();
    table.string("email", 255).unique();
    table.string("password", 255).notNullable();
    table.string("role", 50).notNullable().defaultTo("guest");
    table.uuid("uuid").notNullable();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("users");
}
