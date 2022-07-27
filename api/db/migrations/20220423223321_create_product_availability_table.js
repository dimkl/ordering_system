/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
  return knex.schema
    .createTable('product_availability', function (table) {
      table.increments('id');
      table.timestamps(true, true);
      table.integer('quantity').unsigned().notNullable().defaultTo(0);
      table.integer('shop_id').unsigned().notNullable();
      table.integer('product_id').unsigned().notNullable();

      table.foreign('shop_id').references('shops.id');
      table.foreign('product_id').references('products.id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("product_availability");
};
