/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex.raw('truncate products, orders, order_items cascade');
  await knex('products').insert([
    { title: "Product", sku: "product-code-1", description: "Product description" }
  ]);
};
