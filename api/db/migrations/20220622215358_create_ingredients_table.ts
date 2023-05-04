import type { Knex } from "knex";

// https://schema.org/RestrictedDiet
// copied from api/src/products/schema/ingredient.json#suitable_for_diet
const DIETS = Object.freeze([
  "all",
  "diabetic",
  "gluten_free",
  "halal",
  "hindu",
  "kosher",
  "low_calorie",
  "low_fat",
  "low_lactose",
  "low_salt",
  "vegan",
  "vegetarian",
]);

export function up(knex: Knex) {
  return knex.schema.createTable("ingredients", function (table) {
    table.increments("id");
    table.timestamps(true, true);
    table.string("title", 255).notNullable().unique();
    table.string("description", 255);
    table.uuid("uuid").notNullable();
    table.boolean("allergen").defaultTo(false);
    table.enum("suitable_for_diet", DIETS).defaultTo("all");
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable("ingredients");
}
