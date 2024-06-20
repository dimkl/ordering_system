import type { Context, Next } from "koa";

import schema from "../schemas/orderItem.create.json";
import { OrderItem, Order } from "../models";
import { Product } from "../../products/models";

const handler = async (ctx: Context, _next: Next) => {
  // @ts-ignore
  const data = ctx.request.validatedData;
  const orderId = await Order.getId(data.order_id);
  const productId = await Product.getId(data.product_id);

  let orderItem = await OrderItem.query()
    .where({ product_id: productId, order_id: orderId })
    .first();
  if (orderItem) {
    await orderItem
      .$query()
      .patch({ quantity: data.quantity + orderItem.quantity });
  } else {
    orderItem = await OrderItem.query().insert({
      ...data,
      order_id: orderId,
      product_id: productId,
    });
  }

  ctx.body = await Order.findWithOrderItemsAndProducts(orderId);
};

export { schema, handler };
