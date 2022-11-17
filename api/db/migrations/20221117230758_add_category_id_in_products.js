/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
    return knex.schema
      .alterTable('products', function (table) {
        table.integer('category_id').unsigned();
  
        table.foreign('category_id').references('categories.id');
      });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema
      .alterTable('products', function (table) {
        table.dropColumn('category_id');
      });
  };
  