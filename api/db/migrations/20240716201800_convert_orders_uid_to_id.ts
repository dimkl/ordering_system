import type { Knex } from "knex";

export async function up(knex: Knex) {
  // 1. update the foreign key values
  await knex.schema.alterTable("order_items", (t) => {
    t.string("order_uid").nullable();
  });
  await knex("order_items")
    .update({ order_uid: knex.ref("orders.uid") })
    .updateFrom("orders")
    .where({ "orders.id": knex.ref("order_items.order_id") });
  // 2. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("order_items", (t) => {
    t.dropForeign("order_id");
  });
  // 3. replace id with uid
  await knex.schema.alterTable("orders", (t) => {
    t.dropPrimary("orders_pkey");
  });
  await knex.schema.alterTable("orders", (t) => {
    t.renameColumn("id", "_id");
    t.renameColumn("uid", "id");
    t.string("id").primary().alter();
  });
  // 4. update the foreign keys constraints
  await knex.schema.alterTable("order_items", (t) => {
    t.dropColumn("order_id");
  });
  await knex.schema.alterTable("order_items", (t) => {
    t.renameColumn("order_uid", "order_id");
  });
  await knex.schema.alterTable("order_items", (t) => {
    t.foreign("order_id").references("orders.id");
  });
  // 5. cleanup step
  await knex.schema.alterTable("orders", (t) => {
    t.dropColumn("_id");
    t.dropColumn("uuid");
  });
}

export async function down(knex: Knex) {
  // 1. introduce auto increment ids
  await knex.schema.alterTable("orders", (t) => {
    t.increments("_id", { primaryKey: false });
  });

  // 2. update the foreign key values
  await knex.schema.alterTable("order_items", (t) => {
    t.integer("_order_id").nullable();
  });
  await knex("order_items")
    .update({ _order_id: knex.ref("orders._id") })
    .updateFrom("orders")
    .where({ "orders.id": knex.ref("order_items.order_id") });
  // 3. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("order_items", (t) => {
    t.dropForeign("order_id");
  });
  // 4. replace id with uid
  await knex.schema.alterTable("orders", (t) => {
    t.dropPrimary("orders_pkey");
  });
  await knex.schema.alterTable("orders", (t) => {
    t.renameColumn("id", "uid");
    t.renameColumn("_id", "id");
    t.primary(["id"]);
  });
  // 5. update the foreign keys constraints
  await knex.schema.alterTable("order_items", (t) => {
    t.dropColumn("order_id");
    t.renameColumn("_order_id", "order_id");
  });
  await knex.schema.alterTable("order_items", (t) => {
    t.foreign("order_id").references("orders.id");
  });
  // 6. restore cleaned up
  await knex.schema.alterTable("orders", (t) => {
    t.uuid("uuid");
  });
  await knex("orders").update({
    uuid: knex.raw("uuid_in(md5(random()::text)::cstring)")
  });
}
