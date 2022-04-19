const Order = require('../models/order');

async function loadOrder(orderId, ctx, next) {
  ctx.order = await Order.findByIdOrUid(orderId).modify('publicColumns');

  if (!ctx.order) return ctx.status = 404;

  return next();
}

module.exports = loadOrder;