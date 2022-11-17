const uuid = require('uuid');

exports.seed = async function (knex) {
  await knex('shops').insert([
    { manager_id: 1, name: 'Shop', uuid: uuid.v4(), opening_time: '08:00', closing_time: '00:00', opening_days: '{0,1,2,3,4,5}' }
  ]);
};
