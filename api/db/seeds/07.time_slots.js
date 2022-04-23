const uuid = require('uuid');

exports.seed = async function (knex) {
  const now = Date.now();

  await knex('time_slots').insert([
    { slot_id: 1, customer_id: 1, uuid: uuid.v4(), started_at: new Date(now), ended_at: new Date(now + 3600000) }
  ]);
};
