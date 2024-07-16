import type { Knex } from "knex";

export async function up(knex: Knex) {
  // 1. update the foreign key values
  await knex.schema.alterTable("orders", (t) => {
    t.string("time_slot_uid").nullable();
  });
  await knex("orders")
    .update({ time_slot_uid: knex.ref("time_slots.uid") })
    .updateFrom("time_slots")
    .where({ "time_slots.id": knex.ref("orders.time_slot_id") });
  // 2. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("orders", (t) => {
    t.dropForeign("time_slot_id");
  });
  // 3. replace id with uid
  await knex.schema.alterTable("time_slots", (t) => {
    t.dropPrimary("time_slots_pkey");
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.renameColumn("id", "_id");
    t.renameColumn("uid", "id");
    t.string("id").primary().alter();
  });
  // 4. update the foreign keys constraints
  await knex.schema.alterTable("orders", (t) => {
    t.dropColumn("time_slot_id");
  });
  await knex.schema.alterTable("orders", (t) => {
    t.renameColumn("time_slot_uid", "time_slot_id");
  });
  await knex.schema.alterTable("orders", (t) => {
    t.foreign("time_slot_id").references("time_slots.id");
  });
  // 5. cleanup step
  await knex.schema.alterTable("time_slots", (t) => {
    t.dropColumn("_id");
    t.dropColumn("uuid");
  });
}

export async function down(knex: Knex) {
  // 1. introduce auto increment ids
  await knex.schema.alterTable("time_slots", (t) => {
    t.increments("_id", { primaryKey: false });
  });

  // 2. update the foreign key values
  await knex.schema.alterTable("orders", (t) => {
    t.integer("_time_slot_id").nullable();
  });
  await knex("orders")
    .update({ _time_slot_id: knex.ref("time_slots._id") })
    .updateFrom("time_slots")
    .where({ "time_slots.id": knex.ref("orders.time_slot_id") });
  // 3. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("orders", (t) => {
    t.dropForeign("time_slot_id");
  });
  // 4. replace id with uid
  await knex.schema.alterTable("time_slots", (t) => {
    t.dropPrimary("time_slots_pkey");
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.renameColumn("id", "uid");
    t.renameColumn("_id", "id");
    t.primary(["id"]);
  });
  // 5. update the foreign keys constraints
  await knex.schema.alterTable("orders", (t) => {
    t.dropColumn("time_slot_id");
    t.renameColumn("_time_slot_id", "time_slot_id");
  });
  await knex.schema.alterTable("orders", (t) => {
    t.foreign("time_slot_id").references("time_slots.id");
  });
  // 6. restore cleaned up
  await knex.schema.alterTable("time_slots", (t) => {
    t.uuid("uuid");
  });
  await knex("time_slots").update({
    uuid: knex.raw("uuid_in(md5(random()::text)::cstring)")
  });
}
