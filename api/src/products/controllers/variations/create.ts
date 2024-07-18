import type { Context } from "koa";

import schema from "../../schemas/variation.create.json";

import { Product, ProductIngredient } from "../../models";
import { ProductOfVariationRequired } from "../../errors";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const { ingredients, ...data } = ctx.request.validatedData;

  // A product varation cannot be a variant of another product
  const variant = data.variant_id && (await Product.query().findById(data.variant_id));
  if (variant?.variant_id) {
    throw new ProductOfVariationRequired();
  }

  // TODO(dimkl): should have at least 1 different ingredient from the variant

  const variation = await Product.query().modify("publicColumns").insert(data);

  const productIngredientsData = ingredients.map((ingredientId) => ({
    ingredient_id: ingredientId,
    product_id: variation.id
  }));
  await ProductIngredient.query().insert(productIngredientsData);

  ctx.body = await Product.findVariationsWithIngredients(variation.variant_id);
};

export { schema, handler };
