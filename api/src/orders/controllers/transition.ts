import type { Context } from "koa";

import { Order } from "../models";
import { OrderTransition } from "../services/orderTransition";

import schema from "../schemas/order.transition.json";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;
  const order = await Order.findWithOrderItemsAndProducts(ctx.order.id);
  await OrderTransition.process(order, data.action);

  ctx.body = order;
};

export { schema, handler };
