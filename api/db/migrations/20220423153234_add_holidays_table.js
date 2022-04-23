/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
  return knex.schema
    .createTable('holidays', function (table) {
      table.increments('id');
      table.timestamps(true, true);
      table.timestamp('date').notNullable();
      table.string('name').notNullable();
      table.integer('shop_id').unsigned().notNullable();

      table.foreign('shop_id').references('shops.id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("holidays");
};
