import type { Context } from "koa";

import { Order } from "../models";
import { OrderItemTransition } from "../services/orderItemTransition";

import schema from "../schemas/orderItem.transition.json";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;
  const order = await Order.findWithOrderItemsAndProducts(ctx.orderItem.order_id);
  if (!order) return;

  const orderItem = order.order_items.find((oi) => oi.id === ctx.orderItem.id);
  await OrderItemTransition.process(orderItem, order, data.action);

  ctx.body = order;
};

export { schema, handler };
