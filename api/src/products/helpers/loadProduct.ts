import type { Context, Next } from "koa";

import { Product } from "../models";

export async function loadProduct(
  productId: number | string,
  ctx: Context,
  next: Next
) {
  ctx.product = await Product.findByIdOrUid(productId).modify("publicColumns");

  if (!ctx.product) return (ctx.status = 404);

  return next();
}
