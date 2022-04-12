/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('orders', (table) => table.uuid('uuid').notNullable());
  await knex.schema.alterTable('order_items', (table) => table.uuid('uuid').notNullable());
  await knex.schema.alterTable('products', (table) => table.uuid('uuid').notNullable());
  await knex.schema.alterTable('customers', (table) => table.uuid('uuid').notNullable());
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('orders', (table) => table.dropColumn('uuid'));
  await knex.schema.alterTable('order_items', (table) => table.dropColumn('uuid'));
  await knex.schema.alterTable('products', (table) => table.dropColumn('uuid'));
  await knex.schema.alterTable('customers', (table) => table.dropColumn('uuid'));
};
