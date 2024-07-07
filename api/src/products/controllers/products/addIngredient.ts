import type { Context } from "koa";

import schema from "../../schemas/productIngredient.create.json";
import { ProductIngredient, Product } from "../../models";

import { loadProduct } from "../../helpers/loadProduct";
import { loadIngredient } from "../../helpers/loadIngredient";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;

  await loadProduct(data.product_id, ctx, async () => {});
  await loadIngredient(data.ingredient_id, ctx, async () => {});

  const insertData = {
    ...data,
    product_id: ctx.product.id,
    ingredient_id: ctx.ingredient.id
  };

  await ProductIngredient.query().insert(insertData);

  ctx.body = await Product.findWithIngredients(ctx.product.id);
};

export { schema, handler };
