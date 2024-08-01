import type { Knex } from "knex";

// copied from api/src/products/schema/productIngredient.json#selection_type
const SELECTION_TYPES = Object.freeze(["primary", "extra", "primary_extra"]);

export function up(knex: Knex) {
  return knex.schema.alterTable("product_ingredients", function (table) {
    table.enum("selection_type", SELECTION_TYPES).defaultTo("primary").notNullable();
  });
}

export function down(knex: Knex) {
  return knex.schema.alterTable("product_ingredients", function (table) {
    table.dropColumn("selection_type");
  });
}
