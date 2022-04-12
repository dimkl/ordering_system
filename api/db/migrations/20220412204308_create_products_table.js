/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
  return knex.schema
    .createTable('products', function (table) {
      table.increments('id');
      table.timestamps(true, true);
      table.string('title', 255).notNullable();
      table.string('description', 255);
      table.string('qr', 255);
      table.string('sku', 100);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("products");
};
