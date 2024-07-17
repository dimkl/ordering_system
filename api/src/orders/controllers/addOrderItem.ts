import type { Context } from "koa";

import { ForeignKeyViolationError } from "objection";

import schema from "../schemas/orderItem.create.json";
import { OrderItem, Order } from "../models";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;
  const { order_id: orderId, product_id: productId } = data;

  let orderItem = await OrderItem.query()
    .where({ product_id: productId, order_id: orderId })
    .first();
  if (orderItem) {
    await orderItem.$query().patch({ quantity: data.quantity + orderItem.quantity });
  } else {
    try {
      orderItem = await OrderItem.query().insert(data);
    } catch (err) {
      if (err instanceof ForeignKeyViolationError) {
        return;
      }
      throw err;
    }
  }

  ctx.body = await Order.findWithOrderItemsAndProducts(orderId);
};

export { schema, handler };
