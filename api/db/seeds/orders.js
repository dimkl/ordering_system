/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('orders').truncate();
  await knex('orders').insert([
    { customer_id: 1, state: 'draft' },
  ]);
};
