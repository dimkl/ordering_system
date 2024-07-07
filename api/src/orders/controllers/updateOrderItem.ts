import type { Context, Next } from "koa";

import schema from "../schemas/orderItem.patch.json";
import { Order } from "../models";

const handler = async (ctx: Context, _next: Next) => {
  // @ts-ignore
  const data = ctx.request.validatedData;
  const orderId = ctx.orderItem.order_id;

  if (Object.keys(data).length > 0) {
    await ctx.orderItem.$query().patch(data).returning("*");
  }

  ctx.body = await Order.findWithOrderItemsAndProducts(orderId);
};

export { schema, handler };
