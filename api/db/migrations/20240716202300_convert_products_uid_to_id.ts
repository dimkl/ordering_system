import type { Knex } from "knex";

export async function up(knex: Knex) {
  // 1. update the foreign key values
  await knex.schema.alterTable("order_items", (t) => {
    t.string("product_uid").nullable();
  });
  await knex("order_items")
    .update({ product_uid: knex.ref("products.uid") })
    .updateFrom("products")
    .where({ "products.id": knex.ref("order_items.product_id") });

  await knex.schema.alterTable("product_availability", (t) => {
    t.string("product_uid").nullable();
  });
  await knex("product_availability")
    .update({ product_uid: knex.ref("products.uid") })
    .updateFrom("products")
    .where({ "products.id": knex.ref("product_availability.product_id") });

  await knex.schema.alterTable("product_ingredients", (t) => {
    t.string("product_uid").nullable();
  });
  await knex("product_ingredients")
    .update({ product_uid: knex.ref("products.uid") })
    .updateFrom("products")
    .where({ "products.id": knex.ref("product_ingredients.product_id") });

  await knex.schema.alterTable("products", (t) => {
    t.string("variant_uid").nullable();
  });
  await knex("products")
    .update({ variant_uid: knex.ref("p.uid") })
    .updateFrom("products as p")
    .where({ "products.id": knex.ref("p.variant_id") })
    .where(knex.ref("p.variant_id"), "is not", null);
  // 2. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("order_items", (t) => {
    t.dropForeign("product_id");
  });
  await knex.schema.alterTable("product_availability", (t) => {
    t.dropForeign("product_id");
  });
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.dropForeign("product_id");
  });
  await knex.schema.alterTable("products", (t) => {
    t.dropForeign("variant_id");
  });
  // 3. replace id with uid
  await knex.schema.alterTable("products", (t) => {
    t.dropPrimary("products_pkey");
  });
  await knex.schema.alterTable("products", (t) => {
    t.renameColumn("id", "_id");
    t.renameColumn("uid", "id");
    t.string("id").primary().alter();
  });
  // 4. update the foreign keys constraints
  await knex.schema.alterTable("order_items", (t) => {
    t.dropColumn("product_id");
  });
  await knex.schema.alterTable("order_items", (t) => {
    t.renameColumn("product_uid", "product_id");
  });
  await knex.schema.alterTable("order_items", (t) => {
    t.foreign("product_id").references("products.id");
  });

  await knex.schema.alterTable("product_availability", (t) => {
    t.dropColumn("product_id");
  });
  await knex.schema.alterTable("product_availability", (t) => {
    t.renameColumn("product_uid", "product_id");
  });
  await knex.schema.alterTable("product_availability", (t) => {
    t.foreign("product_id").references("products.id");
  });

  await knex.schema.alterTable("product_ingredients", (t) => {
    t.dropColumn("product_id");
  });
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.renameColumn("product_uid", "product_id");
  });
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.foreign("product_id").references("products.id");
  });

  await knex.schema.alterTable("products", (t) => {
    t.dropColumn("variant_id");
  });
  await knex.schema.alterTable("products", (t) => {
    t.renameColumn("variant_uid", "variant_id");
  });
  await knex.schema.alterTable("products", (t) => {
    t.foreign("variant_id").references("products.id");
  });
  // 5. cleanup step
  await knex.schema.alterTable("products", (t) => {
    t.dropColumn("_id");
    t.dropColumn("uuid");
  });
}

export async function down(knex: Knex) {
  // 1. introduce auto increment ids
  await knex.schema.alterTable("products", (t) => {
    t.increments("_id", { primaryKey: false });
  });

  // 2. update the foreign key values
  await knex.schema.alterTable("order_items", (t) => {
    t.integer("_product_id").nullable();
  });
  await knex("order_items")
    .update({ _product_id: knex.ref("products._id") })
    .updateFrom("products")
    .where({ "products.id": knex.ref("order_items.product_id") });

  await knex.schema.alterTable("product_availability", (t) => {
    t.integer("_product_id").nullable();
  });
  await knex("product_availability")
    .update({ _product_id: knex.ref("products._id") })
    .updateFrom("products")
    .where({ "products.id": knex.ref("product_availability.product_id") });

  await knex.schema.alterTable("product_ingredients", (t) => {
    t.integer("_product_id").nullable();
  });
  await knex("product_ingredients")
    .update({ _product_id: knex.ref("products._id") })
    .updateFrom("products")
    .where({ "products.id": knex.ref("product_ingredients.product_id") });

  await knex.schema.alterTable("products", (t) => {
    t.integer("_variant_id").nullable();
  });
  await knex("products")
    .update({ _variant_id: knex.ref("p._id") })
    .updateFrom("products as p")
    .where({ "products.id": knex.ref("p.variant_id") })
    .where(knex.ref("p.variant_id"), "is not", null);
  // 3. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("order_items", (t) => {
    t.dropForeign("product_id");
  });
  await knex.schema.alterTable("product_availability", (t) => {
    t.dropForeign("product_id");
  });
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.dropForeign("product_id");
  });
  await knex.schema.alterTable("products", (t) => {
    t.dropForeign("variant_id");
  });
  // 4. replace id with uid
  await knex.schema.alterTable("products", (t) => {
    t.dropPrimary("products_pkey");
  });
  await knex.schema.alterTable("products", (t) => {
    t.renameColumn("id", "uid");
    t.renameColumn("_id", "id");
    t.primary(["id"]);
  });
  // 5. update the foreign keys constraints
  await knex.schema.alterTable("order_items", (t) => {
    t.dropColumn("product_id");
    t.renameColumn("_product_id", "product_id");
  });
  await knex.schema.alterTable("order_items", (t) => {
    t.foreign("product_id").references("products.id");
  });

  await knex.schema.alterTable("product_availability", (t) => {
    t.dropColumn("product_id");
    t.renameColumn("_product_id", "product_id");
  });
  await knex.schema.alterTable("product_availability", (t) => {
    t.foreign("product_id").references("products.id");
  });

  await knex.schema.alterTable("product_ingredients", (t) => {
    t.dropColumn("product_id");
    t.renameColumn("_product_id", "product_id");
  });
  await knex.schema.alterTable("product_ingredients", (t) => {
    t.foreign("product_id").references("products.id");
  });

  await knex.schema.alterTable("products", (t) => {
    t.dropColumn("variant_id");
    t.renameColumn("_variant_id", "variant_id");
  });
  await knex.schema.alterTable("products", (t) => {
    t.foreign("variant_id").references("products.id");
  });
  // 6. restore cleaned up
  await knex.schema.alterTable("products", (t) => {
    t.uuid("uuid");
  });
  await knex("products").update({
    uuid: knex.raw("uuid_in(md5(random()::text)::cstring)")
  });
}
