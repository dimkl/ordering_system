const ajv = require('../../shared/ajv');
const { ValidationError } = require("ajv");
const { UniqueViolationError } = require('objection-db-errors');

const schema = require('../schemas/order.create.json');
const Order = require('../models/order');
const Customer = require('../../customers/models/customer');

ajv.addSchema(schema);
ajv.validateSchema(schema);

const handler = async (ctx, next) => {
  const validate = ajv.compile(schema);
  const requestBody = ctx.request.body;

  try {
    const data = await validate(requestBody);
    const customerId = await Customer.getId(requestBody.customer_id);

    const order = await Order.query().insert({ ...data, customer_id: customerId });
    ctx.body = await Order.query().modify('publicColumns').findById(order.id);
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
