module.exports = async () => {
  const knex = require("../../src/shared/knex");
  await knex.destroy();
}