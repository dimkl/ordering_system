const ajv = require('../../shared/ajv');

const schema = require('../schemas/orderItem.patch.json');
const Order = require('../models/order');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);
  const requestBody = ctx.request.body;

  const orderId = ctx.orderItem.order_id;
  const data = await validate(requestBody);

  await ctx.orderItem.$query().patch(data);

  ctx.body = await Order.findWithOrderItemsAndProducts(orderId);
}

module.exports = handler;
