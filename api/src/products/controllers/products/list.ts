import type { Context, Next } from "koa";

import { Product } from "../../models";

export const handler = async (ctx: Context, next: Next) => {
  if (ctx.product) {
    ctx.body = ctx.product;
    return next();
  }

  ctx.body = await Product.query().modify(["publicColumns", "variations", ...ctx.state.included]);
};
