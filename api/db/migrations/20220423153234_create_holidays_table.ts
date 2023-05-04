import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("holidays", function (table) {
    table.increments("id");
    table.timestamps(true, true);
    table.timestamp("date").notNullable();
    table.string("name").notNullable();
    table.integer("shop_id").unsigned().notNullable();

    table.foreign("shop_id").references("shops.id");
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("holidays");
}
