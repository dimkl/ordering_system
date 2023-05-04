import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("slots", function (table) {
    table.increments("id");
    table.timestamps(true, true);
    table.uuid("uuid").notNullable();
    table.integer("section_id").unsigned().notNullable();
    table.integer("user_id").unsigned();
    table.string("sku", 100).notNullable();
    table.boolean("active").defaultTo(false);

    table.foreign("section_id").references("sections.id");
    table.foreign("user_id").references("users.id");
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("slots");
}
