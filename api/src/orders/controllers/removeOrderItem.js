const ajv = require('../../shared/ajv');
const { ValidationError } = require("ajv");
const { UniqueViolationError } = require('objection-db-errors');

const OrderItem = require('../models/orderItem');
const Order = require('../models/order');


const handler = async (ctx, next) => {
  try {
    await ctx.orderItem.$query().delete();

    ctx.body = await Order.findWithOrderItemsAndProducts(ctx.orderItem.order_id);
  } catch (err) {
    if (err instanceof ValidationError) {
      ctx.status = 400;
      ctx.body = err.errors;
    } else if (err instanceof UniqueViolationError) {
      ctx.status = 422;
      ctx.body = { message: `${err.columns.join(',')} already exists!` };
    }
    debugger;
  }
};

module.exports = { handler };
