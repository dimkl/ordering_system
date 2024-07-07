exports.seed = async function (knex) {
  await knex("product_ingredients").insert([{ product_id: 1, ingredient_id: 1 }]);
};
