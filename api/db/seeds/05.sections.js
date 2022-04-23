const uuid = require('uuid');

exports.seed = async function (knex) {
  await knex('sections').insert([
    { shop_id: 1, user_id: 1, name: 'Section', sku: 'section-1', uuid: uuid.v4() }
  ]);
};
