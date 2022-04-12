/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
  return knex.schema
    .createTable('orders', function (table) {
      table.increments('id');
      table.integer('customer_id').unsigned();
      table.string('state', 50).notNullable().defaultTo('draft');
      table.timestamps(true, true);

      table.foreign('customer_id').references('customers.id')
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("orders");
};
