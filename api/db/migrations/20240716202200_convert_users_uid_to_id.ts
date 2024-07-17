import type { Knex } from "knex";

export async function up(knex: Knex) {
  // 1. update the foreign key values
  await knex.schema.alterTable("shops", (t) => {
    t.string("manager_uid").nullable();
  });
  await knex("shops")
    .update({ manager_uid: knex.ref("users.uid") })
    .updateFrom("users")
    .where({ "users.id": knex.ref("shops.manager_id") });

  await knex.schema.alterTable("sections", (t) => {
    t.string("user_uid").nullable();
  });
  await knex("sections")
    .update({ user_uid: knex.ref("users.uid") })
    .updateFrom("users")
    .where({ "users.id": knex.ref("sections.user_id") });

  await knex.schema.alterTable("slots", (t) => {
    t.string("user_uid").nullable();
  });
  await knex("slots")
    .update({ user_uid: knex.ref("users.uid") })
    .updateFrom("users")
    .where({ "users.id": knex.ref("slots.user_id") });
  // 2. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("shops", (t) => {
    t.dropForeign("manager_id");
  });
  await knex.schema.alterTable("sections", (t) => {
    t.dropForeign("user_id");
  });
  await knex.schema.alterTable("slots", (t) => {
    t.dropForeign("user_id");
  });
  // 3. replace id with uid
  await knex.schema.alterTable("users", (t) => {
    t.dropPrimary("users_pkey");
  });
  await knex.schema.alterTable("users", (t) => {
    t.renameColumn("id", "_id");
    t.renameColumn("uid", "id");
    t.string("id").primary().alter();
  });
  // 4. update the foreign keys constraints
  await knex.schema.alterTable("shops", (t) => {
    t.dropColumn("manager_id");
  });
  await knex.schema.alterTable("shops", (t) => {
    t.renameColumn("manager_uid", "manager_id");
  });
  await knex.schema.alterTable("shops", (t) => {
    t.foreign("manager_id").references("users.id");
  });

  await knex.schema.alterTable("sections", (t) => {
    t.dropColumn("user_id");
  });
  await knex.schema.alterTable("sections", (t) => {
    t.renameColumn("user_uid", "user_id");
  });
  await knex.schema.alterTable("sections", (t) => {
    t.foreign("user_id").references("users.id");
  });

  await knex.schema.alterTable("slots", (t) => {
    t.dropColumn("user_id");
  });
  await knex.schema.alterTable("slots", (t) => {
    t.renameColumn("user_uid", "user_id");
  });
  await knex.schema.alterTable("slots", (t) => {
    t.foreign("user_id").references("users.id");
  });
  // 5. cleanup step
  await knex.schema.alterTable("users", (t) => {
    t.dropColumn("_id");
    t.dropColumn("uuid");
  });
}

export async function down(knex: Knex) {
  // 1. introduce auto increment ids
  await knex.schema.alterTable("users", (t) => {
    t.increments("_id", { primaryKey: false });
  });

  // 2. update the foreign key values
  await knex.schema.alterTable("shops", (t) => {
    t.integer("_manager_id").nullable();
  });
  await knex("shops")
    .update({ _manager_id: knex.ref("users._id") })
    .updateFrom("users")
    .where({ "users.id": knex.ref("shops.manager_id") });

  await knex.schema.alterTable("sections", (t) => {
    t.integer("_user_id").nullable();
  });
  await knex("sections")
    .update({ _user_id: knex.ref("users._id") })
    .updateFrom("users")
    .where({ "users.id": knex.ref("sections.user_id") });

  await knex.schema.alterTable("slots", (t) => {
    t.integer("_user_id").nullable();
  });
  await knex("slots")
    .update({ _user_id: knex.ref("users._id") })
    .updateFrom("users")
    .where({ "users.id": knex.ref("slots.user_id") });
  // 3. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("shops", (t) => {
    t.dropForeign("manager_id");
  });
  await knex.schema.alterTable("sections", (t) => {
    t.dropForeign("user_id");
  });
  await knex.schema.alterTable("slots", (t) => {
    t.dropForeign("user_id");
  });
  // 4. replace id with uid
  await knex.schema.alterTable("users", (t) => {
    t.dropPrimary("users_pkey");
  });
  await knex.schema.alterTable("users", (t) => {
    t.renameColumn("id", "uid");
    t.renameColumn("_id", "id");
    t.primary(["id"]);
  });
  // 5. update the foreign keys constraints
  await knex.schema.alterTable("shops", (t) => {
    t.dropColumn("manager_id");
    t.renameColumn("_manager_id", "manager_id");
  });
  await knex.schema.alterTable("shops", (t) => {
    t.foreign("manager_id").references("users.id");
  });

  await knex.schema.alterTable("sections", (t) => {
    t.dropColumn("user_id");
    t.renameColumn("_user_id", "user_id");
  });
  await knex.schema.alterTable("sections", (t) => {
    t.foreign("user_id").references("users.id");
  });

  await knex.schema.alterTable("slots", (t) => {
    t.dropColumn("user_id");
    t.renameColumn("_user_id", "user_id");
  });
  await knex.schema.alterTable("slots", (t) => {
    t.foreign("user_id").references("users.id");
  });
  // 6. restore cleaned up
  await knex.schema.alterTable("users", (t) => {
    t.uuid("uuid");
  });
  await knex("users").update({
    uuid: knex.raw("uuid_in(md5(random()::text)::cstring)")
  });
}
