import type { Context } from "koa";

import schema from "../schemas/orderItem.create.json";
import { OrderItem, Order } from "../models";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;
  const { order_id: orderId, product_id: productId } = data;

  // TODO(dimkl): Replace it with upsert
  const orderItem = await OrderItem.query().findOne({ product_id: productId, order_id: orderId });
  if (orderItem) {
    await orderItem.$query().patch({ quantity: data.quantity + orderItem.quantity });
  } else {
    await OrderItem.query().insert(data);
  }

  ctx.body = await Order.findWithOrderItemsAndProducts(orderId);
};

export { schema, handler };
