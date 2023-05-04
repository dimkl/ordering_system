import type { Context, Next } from "koa";

import { Order } from "../models";

export const handler = async (ctx: Context, _next: Next) => {
  try {
    const orderId = ctx.orderItem.order_id;
    await ctx.orderItem.$query().delete();

    ctx.body = await Order.findWithOrderItemsAndProducts(orderId);
  } catch (err: any) {
    ctx.status = 422;
    ctx.body = { message: err.message };
  }
};
