const ajv = require('../../shared/ajv');

const schema = require('../schemas/orderItem.create.json');
const OrderItem = require('../models/orderItem');
const Order = require('../models/order');
const Product = require('../../products/models/product');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);
  const requestBody = ctx.request.body;

  const orderId = await Order.getId(requestBody.order_id);
  const productId = await Product.getId(requestBody.product_id);
  const data = await validate({ ...requestBody, order_id: orderId, product_id: productId });

  let orderItem = await OrderItem.query().where({ product_id: productId, order_id: orderId }).first();
  if (orderItem) {
    await orderItem.$query().patch({ quantity: data.quantity + orderItem.quantity });
  } else {
    orderItem = await OrderItem.query().insert(data);
  }

  ctx.body = await Order.findWithOrderItemsAndProducts(orderItem.order_id);
}

module.exports = handler;
