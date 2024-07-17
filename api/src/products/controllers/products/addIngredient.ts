import type { Context } from "koa";

import { ForeignKeyViolationError } from "objection";

import schema from "../../schemas/productIngredient.create.json";
import { ProductIngredient, Product } from "../../models";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;

  try {
    await ProductIngredient.query().insert(data);
  } catch (err) {
    if (err instanceof ForeignKeyViolationError) {
      return;
    }
    throw err;
  }

  ctx.body = await Product.findWithIngredients(data.product_id);
};

export { schema, handler };
