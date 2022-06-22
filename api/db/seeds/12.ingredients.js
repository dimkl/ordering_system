const uuid = require('uuid');

exports.seed = async function (knex) {
  await knex('ingredients').insert([
    { title: "Ingredient 1", description: "Ingredient 1 description", uuid: uuid.v4() }
  ]);
};
