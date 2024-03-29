import type { Context, Next } from "koa";

import { Order } from "../models";

export async function loadOrder(
  orderId: number | string,
  ctx: Context,
  next: Next
) {
  ctx.order = await Order.findByIdOrUid(orderId).modify("publicColumns");

  if (!ctx.order) return (ctx.status = 404);

  return next();
}
