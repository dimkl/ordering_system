import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("categories", function (table) {
    table.increments("id");
    table.timestamps(true, true);
    table.string("title", 255).notNullable().unique();
    table.string("description", 255);
    table.uuid("uuid").notNullable();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("categories");
}
