const schema = require("../schemas/orderItem.create.json");
const OrderItem = require("../models/orderItem");
const Order = require("../models/order");
const Product = require("../../products/models/product");

async function handler(ctx, next) {
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

  ctx.body = await Order.findWithOrderItemsAndProducts(orderItem.order_id);
}

module.exports = { schema, handler };
