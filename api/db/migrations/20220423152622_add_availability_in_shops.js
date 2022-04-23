/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .alterTable('shops', function (table) {
      table.time('opening_time');
      table.time('closing_time');
      table.specificType('opening_days', 'jsonb[]');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable('shops', function (table) {
      table.dropColumn('opening_time');
      table.dropColumn('closing_time');
      table.dropColumn('opening_days');
    });
};
