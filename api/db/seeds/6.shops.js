const uuid = require('uuid');

exports.seed = async function (knex) {
  await knex('shops').insert([
    { manager_id: 1, name: 'Shop', uuid: uuid.v4() }
  ]);
};
