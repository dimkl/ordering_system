const uuid = require('uuid');

exports.seed = async function (knex) {
  await knex('order_items').insert([
    { order_id: 1, product_id: 1, state: 'draft', uuid: uuid.v4() }
  ]);
};
