const ajv = require('../../shared/ajv');
const { ValidationError } = require("ajv");
const { UniqueViolationError } = require('objection-db-errors');

const schema = require('../schemas/orderItem.create.json');
const OrderItem = require('../models/orderItem');
const Order = require('../models/order');
const Product = require('../../products/models/product');

ajv.addSchema(schema);
ajv.validateSchema(schema);

const handler = async (ctx, next) => {
  const validate = ajv.compile(schema);
  const requestBody = ctx.request.body;

  try {
    const orderId = ctx.order.id;
    const productId = await Product.getId(requestBody.product_id);
    const data = await validate({ ...requestBody, order_id: orderId, product_id: productId });

    let orderItem = await OrderItem.query().where({ product_id: productId, order_id: orderId }).first();

    if (orderItem) {
      await orderItem.$query().patch({ quantity: data.quantity + orderItem.quantity });
    } else {
      orderItem = await OrderItem.query().insert(data);
    }

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
