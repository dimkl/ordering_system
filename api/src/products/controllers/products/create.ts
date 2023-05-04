import type { Context, Next } from "koa";

import schema from "../../schemas/product.create.json";
import { Product } from "../../models";

const handler = async (ctx: Context, _next: Next) => {
  // @ts-ignore
  const data = ctx.request.validatedData;

  ctx.body = await Product.query().modify("publicInsertColumns").insert(data);
};

export { schema, handler };
