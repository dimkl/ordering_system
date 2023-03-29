const Order = require("../models/order");
const OrderItemTransition = require("../services/orderItemTransition");

const schema = require("../schemas/orderItem.transition.json");

async function handler(ctx, next) {
  const data = ctx.request.validatedData;
  const order = await Order.findWithOrderItemsAndProducts(
    ctx.orderItem.order_id
  );
  const orderItem = order.order_items.filter(
    (oi) => oi.id === ctx.orderItem.id
  )[0];
  await OrderItemTransition.process(orderItem, order, data.action);

  ctx.body = order;
}

module.exports = { schema, handler };
