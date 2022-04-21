const ajv = require('../../shared/ajv');

const Order = require('../models/order');

const schema = require('../schemas/orderItem.transition.json');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);

  const data = await validate({ state: ctx.params.state });

  if (Object.keys(data).length > 0) {
    await ctx.orderItem.$query().patch(data);
  }

  const order = await Order.findWithOrderItemsAndProducts(ctx.orderItem.order_id);

  const allOrderItemsDelivered = order.order_items.every(oi => oi.state === 'delivered');
  if (order.state === 'placed' && ctx.orderItem.state === 'prepared') {
    await order.$query().patch({ state: 'processing' });
  } else if (order.state === 'processing' && allOrderItemsDelivered) {
    await order.$query().patch({ state: 'delivered' });
  }
  
  ctx.body = order;
}

module.exports = { handler, schema };