/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex.raw('truncate orders, order_items cascade');
  await knex('orders').insert([
    { customer_id: 1, state: 'draft' },
  ]);
};
