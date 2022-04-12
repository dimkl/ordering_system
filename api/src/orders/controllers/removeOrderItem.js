const Order = require('../models/order');

const handler = async (ctx, next) => {
  try {
    await ctx.orderItem.$query().delete();

    ctx.body = await Order.findWithOrderItemsAndProducts(ctx.orderItem.order_id);
  } catch (err) {
    ctx.status = 422;
    ctx.body = { message: err.message };
  }
};

module.exports = { handler };
