import type { Context, Next } from "koa";

import { OrderItem } from "../models";

export async function loadOrderItem(orderItemId: number | string, ctx: Context, next: Next) {
  ctx.orderItem = await OrderItem.query()
    .findById(orderItemId)
    .modify("publicColumns")
    .throwIfNotFound();

  // TODO(dimkl): Check if such route exists
  if (!ctx.order) return next();

  if (ctx.orderItem.order_id != ctx.order.id) {
    ctx.status = 400;
    ctx.body = {
      message: `Order item ${ctx.orderItem.id} does not belong to order ${ctx.order.id}`
    };
    return;
  }

  return next();
}
