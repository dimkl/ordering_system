const uuid = require('uuid');

exports.seed = async function (knex) {
  await knex('products').insert([
    { title: "Product", sku: "product-code-1", description: "Product description", uuid: uuid.v4(), id: 1 },
    { title: "Product (variant 1)", sku: "product-code-1-1", description: "Product variant 1 description", uuid: uuid.v4(), id: 2, variant_id: 1 },
    { title: "Product (variant 2)", sku: "product-code-1-2", description: "Product variant 2 description", uuid: uuid.v4(), id: 3, variant_id: 1 }
  ]);
};
