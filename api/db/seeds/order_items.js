/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex.raw('truncate order_items cascade');
  await knex('order_items').insert([
    { order_id: 1, product_id: 1, state: 'draft' }
  ]);
};
