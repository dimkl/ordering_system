import type { Context, Next } from "koa";

import { Shop } from "../../shops/models/shop";

export async function loadShop(
  shopId: number | string,
  ctx: Context,
  next: Next
) {
  ctx.shop = await Shop.findByIdOrUid(shopId).modify("publicColumns");

  if (!ctx.shop) return (ctx.status = 404);

  return next();
}
