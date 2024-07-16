import type { Knex } from "knex";

export async function up(knex: Knex) {
  // 1. update the foreign key values
  await knex.schema.alterTable("time_slots", (t) => {
    t.string("slot_uid").nullable();
  });
  await knex("time_slots")
    .update({ slot_uid: knex.ref("slots.uid") })
    .updateFrom("slots")
    .where({ "slots.id": knex.ref("time_slots.slot_id") });
  // 2. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("time_slots", (t) => {
    t.dropForeign("slot_id");
  });
  // 3. replace id with uid
  await knex.schema.alterTable("slots", (t) => {
    t.dropPrimary("slots_pkey");
  });
  await knex.schema.alterTable("slots", (t) => {
    t.renameColumn("id", "_id");
    t.renameColumn("uid", "id");
    t.string("id").primary().alter();
  });
  // 4. update the foreign keys constraints
  await knex.schema.alterTable("time_slots", (t) => {
    t.dropColumn("slot_id");
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.renameColumn("slot_uid", "slot_id");
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.foreign("slot_id").references("slots.id");
  });
  // 5. cleanup step
  await knex.schema.alterTable("slots", (t) => {
    t.dropColumn("_id");
    t.dropColumn("uuid");
  });
}

export async function down(knex: Knex) {
  // 1. introduce auto increment ids
  await knex.schema.alterTable("slots", (t) => {
    t.increments("_id", { primaryKey: false });
  });

  // 2. update the foreign key values
  await knex.schema.alterTable("time_slots", (t) => {
    t.integer("_slot_id").nullable();
  });
  await knex("time_slots")
    .update({ _slot_id: knex.ref("slots._id") })
    .updateFrom("slots")
    .where({ "slots.id": knex.ref("time_slots.slot_id") });
  // 3. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("time_slots", (t) => {
    t.dropForeign("slot_id");
  });
  // 4. replace id with uid
  await knex.schema.alterTable("slots", (t) => {
    t.dropPrimary("slots_pkey");
  });
  await knex.schema.alterTable("slots", (t) => {
    t.renameColumn("id", "uid");
    t.renameColumn("_id", "id");
    t.primary(["id"]);
  });
  // 5. update the foreign keys constraints
  await knex.schema.alterTable("time_slots", (t) => {
    t.dropColumn("slot_id");
    t.renameColumn("_slot_id", "slot_id");
  });
  await knex.schema.alterTable("time_slots", (t) => {
    t.foreign("slot_id").references("slots.id");
  });
  // 6. restore cleaned up
  await knex.schema.alterTable("slots", (t) => {
    t.uuid("uuid");
  });
  await knex("slots").update({
    uuid: knex.raw("uuid_in(md5(random()::text)::cstring)")
  });
}
