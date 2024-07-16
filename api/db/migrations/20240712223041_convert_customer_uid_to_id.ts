import type { Knex } from "knex";

export async function up(knex: Knex) {
  // 1. update the foreign key values
  await knex.schema.alterTable("orders", (t) => {
    t.string("customer_uid").nullable();
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.string("customer_uid").nullable();
  });
  await knex("orders")
    .update({ customer_uid: knex.ref("customers.uid") })
    .updateFrom("customers")
    .where({ "customers.id": knex.ref("orders.customer_id") });
  await knex("time_slots")
    .update({ customer_uid: knex.ref("customers.uid") })
    .updateFrom("customers")
    .where({ "customers.id": knex.ref("time_slots.customer_id") });
  // 2. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("orders", (t) => {
    t.dropForeign("customer_id");
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.dropForeign("customer_id");
  });
  // 3. replace id with uid
  await knex.schema.alterTable("customers", (t) => {
    t.dropPrimary("customers_pkey");
  });
  await knex.schema.alterTable("customers", (t) => {
    t.renameColumn("id", "_id");
    t.renameColumn("uid", "id");
    t.string("id").primary().alter();
  });
  // 5. update the foreign keys constraints
  await knex.schema.alterTable("orders", (t) => {
    t.dropColumn("customer_id");
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.dropColumn("customer_id");
  });

  await knex.schema.alterTable("orders", (t) => {
    t.renameColumn("customer_uid", "customer_id");
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.renameColumn("customer_uid", "customer_id");
  });

  await knex.schema.alterTable("orders", (t) => {
    t.foreign("customer_id").references("customers.id");
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.foreign("customer_id").references("customers.id");
  });
  // 6. cleanup step
  await knex.schema.alterTable("customers", (t) => {
    t.dropColumn("_id");
    t.dropColumn("uuid");
  });
}

export async function down(knex: Knex) {
  // 1. introduce auto increment ids
  await knex.schema.alterTable("customers", (t) => {
    t.increments("_id", { primaryKey: false });
  });

  // 2. update the foreign key values
  await knex.schema.alterTable("orders", (t) => {
    t.integer("_customer_id").nullable();
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.integer("_customer_id").nullable();
  });
  await knex("orders")
    .update({ _customer_id: knex.ref("customers._id") })
    .updateFrom("customers")
    .where({ "customers.id": knex.ref("orders.customer_id") });
  await knex("time_slots")
    .update({ _customer_id: knex.ref("customers._id") })
    .updateFrom("customers")
    .where({ "customers.id": knex.ref("time_slots.customer_id") });

  // 3. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("orders", (t) => {
    t.dropForeign("customer_id");
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.dropForeign("customer_id");
  });
  // 4. replace id with uid
  await knex.schema.alterTable("customers", (t) => {
    t.dropPrimary("customers_pkey");
  });
  await knex.schema.alterTable("customers", (t) => {
    t.renameColumn("id", "uid");
    t.renameColumn("_id", "id");
    t.primary(["id"]);
  });
  // 5. update the foreign keys constraints
  await knex.schema.alterTable("orders", (t) => {
    t.dropColumn("customer_id");
    t.renameColumn("_customer_id", "customer_id");
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.dropColumn("customer_id");
    t.renameColumn("_customer_id", "customer_id");
  });

  await knex.schema.alterTable("orders", (t) => {
    t.foreign("customer_id").references("customers.id");
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.foreign("customer_id").references("customers.id");
  });
  // 6. restore cleaned up
  await knex.schema.alterTable("customers", (t) => {
    t.uuid("uuid");
  });
  await knex("customers").update({
    uuid: knex.raw("uuid_in(md5(random()::text)::cstring)")
  });
}
