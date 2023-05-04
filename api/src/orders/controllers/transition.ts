import { Order } from "../models";
import { OrderTransition } from "../services/orderTransition";

import schema from "../schemas/order.transition.json";

import type { Context, Next } from "koa";

const handler = async (ctx: Context, next: Next) => {
  // @ts-ignore
  const data = ctx.request.validatedData;
  const order = await Order.findWithOrderItemsAndProducts(ctx.order.id);
  await OrderTransition.process(order, data.action);

  ctx.body = order;
};

export { schema, handler };
