const uuid = require('uuid');

exports.seed = async function (knex) {
  await knex('categories').insert([
    { title: "Starters", description: "Starters description", uuid: uuid.v4(), id: 1 },
    { title: "Breakfast", description: "Breakfast description", uuid: uuid.v4(), id: 2 },
    { title: "Main Menu", description: "Main Menu description", uuid: uuid.v4(), id: 3 },
    { title: "Dessert", description: "Dessert description", uuid: uuid.v4(), id: 4 },
    { title: "Beverage", description: "Beverage description", uuid: uuid.v4(), id: 5 }
  ]);
};
