import type { Context } from "koa";

import schema from "../../schemas/variation.create.json";

import { Product, ProductIngredient, Ingredient } from "../../models";
import { loadProduct } from "../../helpers/loadProduct";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const { ingredients: ingIds, ...data } = ctx.request.validatedData;
  await loadProduct(data.variant_id, ctx, async () => {});
  const ingredients = (await Ingredient.whereByIdOrUid(ingIds).throwIfNotFound()) as Ingredient[];

  // TODO: validate that product should NOT be a variant
  // TODO: validate that at least 1 ingredient exists in variant

  const insertData = { ...data, variant_id: ctx.product.id };
  const variation = (await Product.query()
    .modify("publicInsertColumns")
    .insert(insertData)) as Product;

  const productIngredientsData = ingredients.map((ingredient) => ({
    ingredient_id: ingredient.id,
    product_id: variation.id
  }));
  await ProductIngredient.query().insert(productIngredientsData);

  ctx.body = await Product.findVariationsWithIngredients(variation.variant_id);
};

export { schema, handler };
