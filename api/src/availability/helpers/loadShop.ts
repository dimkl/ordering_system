import type { Context, Next } from "koa";

import { Shop } from "../../shops/models/shop";

export async function loadShop(shopId: number | string, ctx: Context, next: Next) {
  ctx.shop = await Shop.query().findById(shopId).modify("publicColumns").throwIfNotFound();

  return next();
}
