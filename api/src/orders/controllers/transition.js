const ajv = require('../../shared/ajv');

const Order = require('../models/order');

const schema = require('../schemas/order.transition.json');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);

  const data = await validate({ state: ctx.params.state });

  if (Object.keys(data).length > 0) {
    await ctx.order.$query().patch(data);
  }

  if (ctx.order.state === 'placed') {
    await ctx.order.$relatedQuery('order_items').patch({ state: 'requested' });
  }

  ctx.body = await Order.findWithOrderItemsAndProducts(ctx.order.id);;
}

module.exports = { handler, schema };