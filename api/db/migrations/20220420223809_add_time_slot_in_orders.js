/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .alterTable('orders', function (table) {
      table.integer('time_slot_id').unsigned().notNullable();

      table.foreign('time_slot_id').references('time_slots.id');
      table.unique('time_slot_id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable('orders', function (table) {
      table.dropColumn('time_slot_id');
    });
};
