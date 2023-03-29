const Order = require("../models/order");
const OrderTransition = require("../services/orderTransition");

const schema = require("../schemas/order.transition.json");

async function handler(ctx, next) {
  const data = ctx.request.validatedData;
  const order = await Order.findWithOrderItemsAndProducts(ctx.order.id);
  await OrderTransition.process(order, data.action);

  ctx.body = order;
}

module.exports = { schema, handler };
