import type { Context, Next } from "koa";

import { Order } from "../models";

export async function loadOrder(orderId: number | string, ctx: Context, next: Next) {
  ctx.order = await Order.query().findById(orderId).modify("publicColumns").throwIfNotFound();

  return next();
}
