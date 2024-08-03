import type { Knex } from "knex";

export async function up(knex: Knex) {
  await knex.schema.alterTable("products", function (table) {
    table.dropColumn("qr");
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable("products", (table) => {
    table.string("qr", 255);
  });
}
