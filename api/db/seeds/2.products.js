const uuid = require('uuid');

exports.seed = async function (knex) {
  await knex('products').insert([
    { title: "Product", sku: "product-code-1", description: "Product description", uuid: uuid.v4() }
  ]);
};
