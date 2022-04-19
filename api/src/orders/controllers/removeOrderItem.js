const Order = require('../models/order');

const handler = async (ctx, next) => {
  try {
    const orderId = ctx.orderItem.order_id;
    await ctx.orderItem.$query().delete();

    ctx.body = await Order.findWithOrderItemsAndProducts(orderId);
  } catch (err) {
    ctx.status = 422;
    ctx.body = { message: err.message };
  }
};

module.exports = { handler };
