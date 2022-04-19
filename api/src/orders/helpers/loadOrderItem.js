const OrderItem = require('../models/orderItem');

async function loadOrderItem(orderItemId, ctx, next) {
  ctx.orderItem = await OrderItem.findByIdOrUid(orderItemId).modify('publicColumns');

  if (!ctx.orderItem) return ctx.status = 404;
  if (!ctx.order) return next();

  if (ctx.orderItem.order_id != ctx.order.id) {
    ctx.status = 400;
    ctx.body = { message: `Order item ${ctx.orderItem.id} does not belong to order ${ctx.order.id}` };
    return;
  }

  return next();
}

module.exports = loadOrderItem;