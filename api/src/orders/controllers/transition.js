const ajv = require('../../shared/ajv');

const Order = require('../models/order');
const OrderTransition = require('../services/orderTransition');

const schema = require('../schemas/order.transition.json');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);

  const data = await validate({ action: ctx.params.action });

  const order = await Order.findWithOrderItemsAndProducts(ctx.order.id);
  await OrderTransition.process(order, data.action);

  ctx.body = order;
}

module.exports = { handler, schema };