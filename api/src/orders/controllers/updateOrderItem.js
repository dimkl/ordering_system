const schema = require('../schemas/orderItem.patch.json');
const Order = require('../models/order');

async function handler(ctx, next) {
  const data = ctx.request.validatedData;
  const orderId = ctx.orderItem.order_id;

  await ctx.orderItem.$query().patch(data);

  ctx.body = await Order.findWithOrderItemsAndProducts(orderId);
}

module.exports = { schema, handler };
