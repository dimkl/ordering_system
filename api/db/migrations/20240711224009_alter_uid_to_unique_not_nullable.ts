import type { Knex } from "knex";

export async function up(knex: Knex) {
  const addUidColumn = (table: Knex.CreateTableBuilder) => {
    table.string("uid").notNullable().unique().alter();
  };

  await knex.schema.alterTable("customers", addUidColumn);
  await knex.schema.alterTable("orders", addUidColumn);
  await knex.schema.alterTable("products", addUidColumn);
  await knex.schema.alterTable("order_items", addUidColumn);
  await knex.schema.alterTable("users", addUidColumn);
  await knex.schema.alterTable("shops", addUidColumn);
  await knex.schema.alterTable("sections", addUidColumn);
  await knex.schema.alterTable("slots", addUidColumn);
  await knex.schema.alterTable("time_slots", addUidColumn);
  await knex.schema.alterTable("holidays", addUidColumn);
  await knex.schema.alterTable("product_availability", addUidColumn);
  await knex.schema.alterTable("ingredients", addUidColumn);
  await knex.schema.alterTable("product_ingredients", addUidColumn);
  await knex.schema.alterTable("categories", addUidColumn);
}

export async function down(knex: Knex) {
  const dropIdColumn = (table: Knex.CreateTableBuilder) => {
    table.string("uid").nullable();
    table.dropUnique(["uid"]);
  };

  await knex.schema.alterTable("customers", dropIdColumn);
  await knex.schema.alterTable("orders", dropIdColumn);
  await knex.schema.alterTable("products", dropIdColumn);
  await knex.schema.alterTable("order_items", dropIdColumn);
  await knex.schema.alterTable("users", dropIdColumn);
  await knex.schema.alterTable("shops", dropIdColumn);
  await knex.schema.alterTable("sections", dropIdColumn);
  await knex.schema.alterTable("slots", dropIdColumn);
  await knex.schema.alterTable("time_slots", dropIdColumn);
  await knex.schema.alterTable("holidays", dropIdColumn);
  await knex.schema.alterTable("product_availability", dropIdColumn);
  await knex.schema.alterTable("ingredients", dropIdColumn);
  await knex.schema.alterTable("product_ingredients", dropIdColumn);
  await knex.schema.alterTable("categories", dropIdColumn);
}
