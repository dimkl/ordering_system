exports.seed = async function (knex) {
  await knex('product_availability').insert([
    { shop_id: 1, product_id: 1, quantity: 2 }
  ]);
};
