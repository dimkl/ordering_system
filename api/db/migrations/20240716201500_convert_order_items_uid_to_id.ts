import type { Knex } from "knex";

export async function up(knex: Knex) {
  // 1. replace id with uid
  await knex.schema.alterTable("order_items", (t) => {
    t.dropPrimary("order_items_pkey");
  });
  await knex.schema.alterTable("order_items", (t) => {
    t.renameColumn("id", "_id");
    t.renameColumn("uid", "id");
    t.string("id").primary().alter();
  });
  // 2. cleanup step
  await knex.schema.alterTable("order_items", (t) => {
    t.dropColumn("_id");
    t.dropColumn("uuid");
  });
}

export async function down(knex: Knex) {
  // 1. introduce auto increment ids
  await knex.schema.alterTable("order_items", (t) => {
    t.increments("_id", { primaryKey: false });
  });
  // 2. replace id with uid
  await knex.schema.alterTable("order_items", (t) => {
    t.dropPrimary("order_items_pkey");
  });
  await knex.schema.alterTable("order_items", (t) => {
    t.renameColumn("id", "uid");
    t.renameColumn("_id", "id");
    t.primary(["id"]);
  });
  // 3. restore cleaned up
  await knex.schema.alterTable("order_items", (t) => {
    t.uuid("uuid");
  });
  await knex("order_items").update({
    uuid: knex.raw("uuid_in(md5(random()::text)::cstring)")
  });
}
