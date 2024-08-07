import type { Knex } from "knex";

export async function up(knex: Knex) {
  await knex.schema.alterTable("ingredients", function (table) {
    table.string("shop_id").notNullable();
    table.foreign("shop_id").references("shops.id");
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable("ingredients", (table) => {
    table.dropForeign("shop_id");
    table.dropColumn("shop_id");
  });
}
