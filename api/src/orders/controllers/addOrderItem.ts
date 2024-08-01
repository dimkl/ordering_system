import type { Context } from "koa";

import schema from "../schemas/orderItem.create.json";
import { OrderItem, Order } from "../models";
import { CreateProductWithIngredientSnapshot } from "../services/createProductWithIngredientSnapshot";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  // eslint-disable-next-line
  const { ingredients, ...data } = ctx.request.validatedData;
  const { order_id: orderId, product_id: productId } = data;

  // TODO(dimkl): Replace it with upsert
  const orderItem = await OrderItem.query().findOne({ product_id: productId, order_id: orderId });

  const service = new CreateProductWithIngredientSnapshot(productId);
  const productSnapshot = await service.process(orderItem, ingredients);

  if (orderItem) {
    const newQuantity = Number(data.quantity || 1) + orderItem.quantity;
    await orderItem.$query().patch({ quantity: newQuantity, product_snapshot: productSnapshot });
  } else {
    await OrderItem.query().insert({ ...data, product_snapshot: productSnapshot });
  }

  ctx.body = await Order.findWithOrderItemsAndProducts(orderId);
};

export { schema, handler };
