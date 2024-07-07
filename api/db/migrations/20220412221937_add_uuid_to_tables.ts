import type { Knex } from "knex";

export async function up(knex: Knex) {
  await knex.schema.alterTable("orders", (table) => table.uuid("uuid").notNullable());
  await knex.schema.alterTable("order_items", (table) => table.uuid("uuid").notNullable());
  await knex.schema.alterTable("products", (table) => table.uuid("uuid").notNullable());
  await knex.schema.alterTable("customers", (table) => table.uuid("uuid").notNullable());
}

export async function down(knex: Knex) {
  await knex.schema.alterTable("orders", (table) => table.dropColumn("uuid"));
  await knex.schema.alterTable("order_items", (table) => table.dropColumn("uuid"));
  await knex.schema.alterTable("products", (table) => table.dropColumn("uuid"));
  await knex.schema.alterTable("customers", (table) => table.dropColumn("uuid"));
}
