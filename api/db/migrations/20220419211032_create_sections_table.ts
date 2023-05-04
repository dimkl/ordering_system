import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("sections", function (table) {
    table.increments("id");
    table.timestamps(true, true);
    table.string("name", 100).notNullable();
    table.string("sku", 100).notNullable();
    table.uuid("uuid").notNullable();
    table.integer("shop_id").unsigned().notNullable();
    table.integer("user_id").unsigned().notNullable();

    table.foreign("shop_id").references("shops.id");
    table.foreign("user_id").references("users.id");

    table.unique(["shop_id", "sku"]);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("sections");
}
