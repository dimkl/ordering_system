module.exports = async () => {
  const knex = require("../../src/shared/knex");
  
  await knex.migrate.latest();
  await knex.raw('truncate customers, orders, order_items, users, products, time_slots, slots, shops, sections cascade;');
};