const ajv = require('../../shared/ajv');
const { ValidationError } = require("ajv");
const { UniqueViolationError } = require('objection-db-errors');

const schema = require('../schemas/orderItem.create.json');
const OrderItem = require('../models/orderItem');
const Order = require('../models/order');

ajv.addSchema(schema);
ajv.validateSchema(schema);

const handler = async (ctx, next) => {
  const validate = ajv.compile(schema);

  try {
    const orderId = parseInt(ctx.params.order_id);
    const data = await validate({ ...ctx.request.body, order_id: orderId });

    const orderItem = await OrderItem.query().insert(data);

    ctx.body = await Order.findWithOrderItemsAndProducts(orderItem.order_id);
  } catch (err) {
    if (err instanceof ValidationError) {
      ctx.status = 400;
      ctx.body = err.errors;
    } else if (err instanceof UniqueViolationError) {
      ctx.status = 422;
      ctx.body = { message: `${err.columns.join(',')} already exists!` };
    }
  }
};

module.exports = { handler, schema };
