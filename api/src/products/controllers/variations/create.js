const schema = require("../../schemas/variation.create.json");

const Product = require("../../models/product");
const ProductIngredient = require("../../models/productIngredient");
const Ingredient = require("../../models/ingredient");

const loadProduct = require("../../helpers/loadProduct");

async function handler(ctx, next) {
  const { ingredients: ingIds, ...data } = ctx.request.validatedData;
  await loadProduct(data.variant_id, ctx, () => {});
  const ingredients = await Ingredient.whereByIdOrUid(ingIds).throwIfNotFound();

  // TODO: validate that product should NOT be a variant
  // TODO: validate that at least 1 ingredient exists in variant

  const insertData = { ...data, variant_id: ctx.product.id };
  const variation = await Product.query()
    .modify("publicInsertColumns")
    .insert(insertData);

  const productIngredientsData = ingredients.map((ingredient) => ({
    ingredient_id: ingredient.id,
    product_id: variation.id,
  }));
  await ProductIngredient.query().insert(productIngredientsData);

  ctx.body = await Product.findVariationsWithIngredients(variation.variant_id);
}

module.exports = { schema, handler };
