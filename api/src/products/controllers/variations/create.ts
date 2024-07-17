import type { Context } from "koa";

import { ForeignKeyViolationError } from "objection";

import schema from "../../schemas/variation.create.json";

import { Product, ProductIngredient } from "../../models";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const { ingredients, ...data } = ctx.request.validatedData;

  // TODO: validate that product should NOT be a variant
  // TODO: validate that at least 1 ingredient exists in variant

  try {
    const variation = await Product.query().modify("publicColumns").insert(data);

    const productIngredientsData = ingredients.map((ingredientId) => ({
      ingredient_id: ingredientId,
      product_id: variation.id
    }));
    await ProductIngredient.query().insert(productIngredientsData);

    ctx.body = await Product.findVariationsWithIngredients(variation.variant_id);
  } catch (err) {
    if (err instanceof ForeignKeyViolationError) {
      return;
    }
    throw err;
  }
};

export { schema, handler };
