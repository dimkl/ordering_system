const uuid = require('uuid');

exports.seed = async function (knex) {
  await knex('slots').insert([
    { section_id: 1, user_id: 1, sku: 'table-1', uuid: uuid.v4(), active: true, capacity: 5 }
  ]);
};
