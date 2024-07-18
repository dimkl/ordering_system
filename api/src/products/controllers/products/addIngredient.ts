import type { Context } from "koa";

import schema from "../../schemas/productIngredient.create.json";
import { ProductIngredient, Product } from "../../models";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;

  await ProductIngredient.query().insert(data);

  ctx.body = await Product.findWithIngredients(data.product_id);
};

export { schema, handler };
