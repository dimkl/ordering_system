import type { Context } from "koa";

import { Order } from "../models";

export const handler = async (ctx: Context) => {
  try {
    const orderId = ctx.orderItem.order_id;
    await ctx.orderItem.$query().delete();

    ctx.body = await Order.findWithOrderItemsAndProducts(orderId);
  } catch (err) {
    ctx.status = 422;
    ctx.body = { message: (err as Error).message };
  }
};
