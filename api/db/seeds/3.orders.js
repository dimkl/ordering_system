const uuid = require('uuid');

exports.seed = async function (knex) {
  await knex('orders').insert([
    { customer_id: 1, state: 'draft', uuid: uuid.v4() },
  ]);
};
