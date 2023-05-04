import type { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable("product_ingredients", function (table) {
    table.increments("id");
    table.timestamps(true, true);
    table.integer("product_id").unsigned().notNullable();
    table.integer("ingredient_id").unsigned().notNullable();

    table.foreign("product_id").references("products.id");
    table.foreign("ingredient_id").references("ingredients.id");

    table.unique(["product_id", "ingredient_id"]);
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("product_ingredients");
}
