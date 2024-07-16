import type { Knex } from "knex";

export async function up(knex: Knex) {
  // 1. update the foreign key values
  await knex.schema.alterTable("products", (t) => {
    t.string("category_uid").nullable();
  });
  await knex("products")
    .update({ category_uid: knex.ref("categories.uid") })
    .updateFrom("categories")
    .where({ "categories.id": knex.ref("products.category_id") });
  // 2. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("products", (t) => {
    t.dropForeign("category_id");
  });
  // 3. replace id with uid
  await knex.schema.alterTable("categories", (t) => {
    t.dropPrimary("categories_pkey");
  });
  await knex.schema.alterTable("categories", (t) => {
    t.renameColumn("id", "_id");
    t.renameColumn("uid", "id");
    t.string("id").primary().alter();
  });
  // 5. update the foreign keys constraints
  await knex.schema.alterTable("products", (t) => {
    t.dropColumn("category_id");
  });
  await knex.schema.alterTable("products", (t) => {
    t.renameColumn("category_uid", "category_id");
  });
  await knex.schema.alterTable("products", (t) => {
    t.foreign("category_id").references("categories.id");
  });
  // 6. cleanup step
  await knex.schema.alterTable("categories", (t) => {
    t.dropColumn("_id");
    t.dropColumn("uuid");
  });
}

export async function down(knex: Knex) {
  // 1. introduce auto increment ids
  await knex.schema.alterTable("categories", (t) => {
    t.increments("_id", { primaryKey: false });
  });
  // 2. update the foreign key values
  await knex.schema.alterTable("products", (t) => {
    t.integer("_category_id").nullable();
  });
  await knex("products")
    .update({ _category_id: knex.ref("categories._id") })
    .updateFrom("categories")
    .where({ "categories.id": knex.ref("products.category_id") });
  // 3. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("products", (t) => {
    t.dropForeign("category_id");
  });
  // 4. replace id with uid
  await knex.schema.alterTable("categories", (t) => {
    t.dropPrimary("categories_pkey");
  });
  await knex.schema.alterTable("categories", (t) => {
    t.renameColumn("id", "uid");
    t.renameColumn("_id", "id");
    t.primary(["id"]);
  });
  // 5. update the foreign keys constraints
  await knex.schema.alterTable("products", (t) => {
    t.dropColumn("category_id");
    t.renameColumn("_category_id", "category_id");
  });
  await knex.schema.alterTable("products", (t) => {
    t.foreign("category_id").references("categories.id");
  });
  // 6. restore cleaned up
  await knex.schema.alterTable("categories", (t) => {
    t.uuid("uuid");
  });
  await knex("categories").update({
    uuid: knex.raw("uuid_in(md5(random()::text)::cstring)")
  });
}
