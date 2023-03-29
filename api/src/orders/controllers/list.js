const Order = require("../models/order");

const handler = async (ctx, next) => {
  if (ctx.order) {
    ctx.body = ctx.order;
    return next();
  }
  ctx.body = await Order.query().modify("publicColumns");
};

module.exports = { handler };
