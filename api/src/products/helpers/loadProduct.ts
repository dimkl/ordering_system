import type { Context, Next } from "koa";

import { Product } from "../models";

export async function loadProduct(productId: number | string, ctx: Context, next: Next) {
  ctx.product = await Product.query().findById(productId).modify("publicColumns").throwIfNotFound();

  return next();
}
