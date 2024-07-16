import type { Knex } from "knex";

export async function up(knex: Knex) {
  // 1. update the foreign key values
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.string("ingredient_uid").nullable();
  });
  await knex("product_ingredients")
    .update({ ingredient_uid: knex.ref("ingredients.uid") })
    .updateFrom("ingredients")
    .where({ "ingredients.id": knex.ref("product_ingredients.ingredient_id") });
  // 2. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.dropForeign("ingredient_id");
  });
  // 3. replace id with uid
  await knex.schema.alterTable("ingredients", (t) => {
    t.dropPrimary("ingredients_pkey");
  });
  await knex.schema.alterTable("ingredients", (t) => {
    t.renameColumn("id", "_id");
    t.renameColumn("uid", "id");
    t.string("id").primary().alter();
  });
  // 4. update the foreign keys constraints
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.dropColumn("ingredient_id");
  });
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.renameColumn("ingredient_uid", "ingredient_id");
  });
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.foreign("ingredient_id").references("ingredients.id");
  });
  // 5. cleanup step
  await knex.schema.alterTable("ingredients", (t) => {
    t.dropColumn("_id");
    t.dropColumn("uuid");
  });
}

export async function down(knex: Knex) {
  // 1. introduce auto increment ids
  await knex.schema.alterTable("ingredients", (t) => {
    t.increments("_id", { primaryKey: false });
  });

  // 2. update the foreign key values
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.integer("_ingredient_id").nullable();
  });
  await knex("product_ingredients")
    .update({ _ingredient_id: knex.ref("ingredients._id") })
    .updateFrom("ingredients")
    .where({ "ingredients.id": knex.ref("product_ingredients.ingredient_id") });
  // 3. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.dropForeign("ingredient_id");
  });
  // 4. replace id with uid
  await knex.schema.alterTable("ingredients", (t) => {
    t.dropPrimary("ingredients_pkey");
  });
  await knex.schema.alterTable("ingredients", (t) => {
    t.renameColumn("id", "uid");
    t.renameColumn("_id", "id");
    t.primary(["id"]);
  });
  // 5. update the foreign keys constraints
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.dropColumn("ingredient_id");
    t.renameColumn("_ingredient_id", "ingredient_id");
  });
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.foreign("ingredient_id").references("ingredients.id");
  });
  // 6. restore cleaned up
  await knex.schema.alterTable("ingredients", (t) => {
    t.uuid("uuid");
  });
  await knex("ingredients").update({
    uuid: knex.raw("uuid_in(md5(random()::text)::cstring)")
  });
}
