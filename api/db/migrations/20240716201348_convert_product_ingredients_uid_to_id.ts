import type { Knex } from "knex";

export async function up(knex: Knex) {
  // 1. replace id with uid
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.dropPrimary("product_ingredients_pkey");
  });
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.renameColumn("id", "_id");
    t.renameColumn("uid", "id");
    t.string("id").primary().alter();
  });
  // 2. cleanup step
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.dropColumn("_id");
  });
}

export async function down(knex: Knex) {
  // 1. introduce auto increment ids
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.increments("_id", { primaryKey: false });
  });
  // 2. replace id with uid
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.dropPrimary("product_ingredients_pkey");
  });
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.renameColumn("id", "uid");
    t.renameColumn("_id", "id");
    t.primary(["id"]);
  });
}
