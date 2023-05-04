import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("shops", function (table) {
    table.increments("id");
    table.timestamps(true, true);
    table.string("name", 100).notNullable();
    table.float("lat");
    table.float("lng");
    table.uuid("uuid").notNullable();
    table.integer("manager_id").unsigned().notNullable();

    table.foreign("manager_id").references("users.id");
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("shops");
}
