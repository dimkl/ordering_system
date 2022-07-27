/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
  return knex.schema
    .createTable('product_ingredients', function (table) {
      table.increments('id');
      table.timestamps(true, true);
      table.integer('product_id').unsigned().notNullable();
      table.integer('ingredient_id').unsigned().notNullable();

      table.foreign('product_id').references('products.id');
      table.foreign('ingredient_id').references('ingredients.id');

      table.unique(['product_id', 'ingredient_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("product_ingredients");
};
