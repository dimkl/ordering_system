module.exports = async () => {
  const knex = require("../../src/shared/knex");
  
  await knex.migrate.latest();
  await knex.raw('truncate customers,orders cascade;')
};