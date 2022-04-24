const ajv = require('../../shared/ajv');

const Order = require('../models/order');
const OrderItemTransition = require('../services/orderItemTransition');

const schema = require('../schemas/orderItem.transition.json');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);

  const data = await validate({ action: ctx.params.action });

  const order = await Order.findWithOrderItemsAndProducts(ctx.orderItem.order_id);
  const orderItem = order.order_items.filter(oi => oi.id === ctx.orderItem.id)[0];
  await OrderItemTransition.process(orderItem, order, data.action);

  ctx.body = order;
}

module.exports = handler;