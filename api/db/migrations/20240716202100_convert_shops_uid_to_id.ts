import type { Knex } from "knex";

export async function up(knex: Knex) {
  // 1. update the foreign key values
  await knex.schema.alterTable("holidays", (t) => {
    t.string("shop_uid").nullable();
  });
  await knex("holidays")
    .update({ shop_uid: knex.ref("shops.uid") })
    .updateFrom("shops")
    .where({ "shops.id": knex.ref("holidays.shop_id") });

  await knex.schema.alterTable("sections", (t) => {
    t.string("shop_uid").nullable();
  });
  await knex("sections")
    .update({ shop_uid: knex.ref("shops.uid") })
    .updateFrom("shops")
    .where({ "shops.id": knex.ref("sections.shop_id") });

  await knex.schema.alterTable("product_availability", (t) => {
    t.string("shop_uid").nullable();
  });
  await knex("product_availability")
    .update({ shop_uid: knex.ref("shops.uid") })
    .updateFrom("shops")
    .where({ "shops.id": knex.ref("product_availability.shop_id") });
  // 2. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("holidays", (t) => {
    t.dropForeign("shop_id");
  });
  await knex.schema.alterTable("sections", (t) => {
    t.dropForeign("shop_id");
  });
  await knex.schema.alterTable("product_availability", (t) => {
    t.dropForeign("shop_id");
  });
  // 3. replace id with uid
  await knex.schema.alterTable("shops", (t) => {
    t.dropPrimary("shops_pkey");
  });
  await knex.schema.alterTable("shops", (t) => {
    t.renameColumn("id", "_id");
    t.renameColumn("uid", "id");
    t.string("id").primary().alter();
  });
  // 4. update the foreign keys constraints
  await knex.schema.alterTable("holidays", (t) => {
    t.dropColumn("shop_id");
  });
  await knex.schema.alterTable("holidays", (t) => {
    t.renameColumn("shop_uid", "shop_id");
  });
  await knex.schema.alterTable("holidays", (t) => {
    t.foreign("shop_id").references("shops.id");
  });

  await knex.schema.alterTable("sections", (t) => {
    t.dropColumn("shop_id");
  });
  await knex.schema.alterTable("sections", (t) => {
    t.renameColumn("shop_uid", "shop_id");
  });
  await knex.schema.alterTable("sections", (t) => {
    t.foreign("shop_id").references("shops.id");
  });

  await knex.schema.alterTable("product_availability", (t) => {
    t.dropColumn("shop_id");
  });
  await knex.schema.alterTable("product_availability", (t) => {
    t.renameColumn("shop_uid", "shop_id");
  });
  await knex.schema.alterTable("product_availability", (t) => {
    t.foreign("shop_id").references("shops.id");
  });
  // 5. cleanup step
  await knex.schema.alterTable("shops", (t) => {
    t.dropColumn("_id");
    t.dropColumn("uuid");
  });
}

export async function down(knex: Knex) {
  // 1. introduce auto increment ids
  await knex.schema.alterTable("shops", (t) => {
    t.increments("_id", { primaryKey: false });
  });

  // 2. update the foreign key values
  await knex.schema.alterTable("holidays", (t) => {
    t.integer("_shop_id").nullable();
  });
  await knex("holidays")
    .update({ _shop_id: knex.ref("shops._id") })
    .updateFrom("shops")
    .where({ "shops.id": knex.ref("holidays.shop_id") });

  await knex.schema.alterTable("sections", (t) => {
    t.integer("_shop_id").nullable();
  });
  await knex("sections")
    .update({ _shop_id: knex.ref("shops._id") })
    .updateFrom("shops")
    .where({ "shops.id": knex.ref("sections.shop_id") });

  await knex.schema.alterTable("product_availability", (t) => {
    t.integer("_shop_id").nullable();
  });
  await knex("product_availability")
    .update({ _shop_id: knex.ref("shops._id") })
    .updateFrom("shops")
    .where({ "shops.id": knex.ref("product_availability.shop_id") });
  // 3. drop foreign keys to allow dropping primary
  await knex.schema.alterTable("holidays", (t) => {
    t.dropForeign("shop_id");
  });
  await knex.schema.alterTable("sections", (t) => {
    t.dropForeign("shop_id");
  });
  await knex.schema.alterTable("product_availability", (t) => {
    t.dropForeign("shop_id");
  });
  // 4. replace id with uid
  await knex.schema.alterTable("shops", (t) => {
    t.dropPrimary("shops_pkey");
  });
  await knex.schema.alterTable("shops", (t) => {
    t.renameColumn("id", "uid");
    t.renameColumn("_id", "id");
    t.primary(["id"]);
  });
  // 5. update the foreign keys constraints
  await knex.schema.alterTable("holidays", (t) => {
    t.dropColumn("shop_id");
    t.renameColumn("_shop_id", "shop_id");
  });
  await knex.schema.alterTable("holidays", (t) => {
    t.foreign("shop_id").references("shops.id");
  });

  await knex.schema.alterTable("sections", (t) => {
    t.dropColumn("shop_id");
    t.renameColumn("_shop_id", "shop_id");
  });
  await knex.schema.alterTable("sections", (t) => {
    t.foreign("shop_id").references("shops.id");
  });

  await knex.schema.alterTable("product_availability", (t) => {
    t.dropColumn("shop_id");
    t.renameColumn("_shop_id", "shop_id");
  });
  await knex.schema.alterTable("product_availability", (t) => {
    t.foreign("shop_id").references("shops.id");
  });
  // 6. restore cleaned up
  await knex.schema.alterTable("shops", (t) => {
    t.uuid("uuid");
  });
  await knex("shops").update({
    uuid: knex.raw("uuid_in(md5(random()::text)::cstring)")
  });
}
