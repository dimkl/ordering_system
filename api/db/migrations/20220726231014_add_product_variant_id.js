/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
  return knex.schema
    .alterTable('products', function (table) {
      table.integer('variant_id').unsigned();

      table.foreign('variant_id').references('products.id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable('products', function (table) {
      table.dropColumn('variant_id');
    });
};
