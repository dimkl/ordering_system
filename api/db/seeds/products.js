/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('products').truncate();
  await knex('products').insert([
    { title: "Product", sku: "product-code-1", description: "Product description" }
  ]);
};
