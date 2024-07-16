import type { Knex } from "knex";

export async function up(knex: Knex) {
  // 1. update the foreign key values
  await knex.schema.alterTable("slots", (t) => {
    t.string("section_uid").nullable();
  });
  await knex("slots")
    .update({ section_uid: knex.ref("sections.uid") })
    .updateFrom("sections")
    .where({ "sections.id": knex.ref("slots.section_id") });
  // 2. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("slots", (t) => {
    t.dropForeign("section_id");
  });
  // 3. replace id with uid
  await knex.schema.alterTable("sections", (t) => {
    t.dropPrimary("sections_pkey");
  });
  await knex.schema.alterTable("sections", (t) => {
    t.renameColumn("id", "_id");
    t.renameColumn("uid", "id");
    t.string("id").primary().alter();
  });
  // 4. update the foreign keys constraints
  await knex.schema.alterTable("slots", (t) => {
    t.dropColumn("section_id");
  });
  await knex.schema.alterTable("slots", (t) => {
    t.renameColumn("section_uid", "section_id");
  });
  await knex.schema.alterTable("slots", (t) => {
    t.foreign("section_id").references("sections.id");
  });
  // 5. cleanup step
  await knex.schema.alterTable("sections", (t) => {
    t.dropColumn("_id");
    t.dropColumn("uuid");
  });
}

export async function down(knex: Knex) {
  // 1. introduce auto increment ids
  await knex.schema.alterTable("sections", (t) => {
    t.increments("_id", { primaryKey: false });
  });

  // 2. update the foreign key values
  await knex.schema.alterTable("slots", (t) => {
    t.integer("_section_id").nullable();
  });
  await knex("slots")
    .update({ _section_id: knex.ref("sections._id") })
    .updateFrom("sections")
    .where({ "sections.id": knex.ref("slots.section_id") });
  // 3. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("slots", (t) => {
    t.dropForeign("section_id");
  });
  // 4. replace id with uid
  await knex.schema.alterTable("sections", (t) => {
    t.dropPrimary("sections_pkey");
  });
  await knex.schema.alterTable("sections", (t) => {
    t.renameColumn("id", "uid");
    t.renameColumn("_id", "id");
    t.primary(["id"]);
  });
  // 5. update the foreign keys constraints
  await knex.schema.alterTable("slots", (t) => {
    t.dropColumn("section_id");
    t.renameColumn("_section_id", "section_id");
  });
  await knex.schema.alterTable("slots", (t) => {
    t.foreign("section_id").references("sections.id");
  });
  // 6. restore cleaned up
  await knex.schema.alterTable("sections", (t) => {
    t.uuid("uuid");
  });
  await knex("sections").update({
    uuid: knex.raw("uuid_in(md5(random()::text)::cstring)")
  });
}
