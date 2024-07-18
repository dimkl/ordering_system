import type { Context, Next } from "koa";

import { Shop } from "../models";

export async function loadShop(shopId: string | number, ctx: Context, next: Next) {
  ctx.shop = await Shop.query().findById(shopId).modify("publicColumns");

  if (!ctx.shop) return (ctx.status = 404);

  return next();
}
