const ajv = require('../../shared/ajv');

const schema = require('../schemas/order.create.json');
const Order = require('../models/order');
const Customer = require('../../customers/models/customer');
const TimeSlot = require('../../slots/models/timeSlot');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);
  const requestBody = ctx.request.body;

  const data = await validate(requestBody);
  const customerId = await Customer.getId(requestBody.customer_id);
  const timeSlotId = await TimeSlot.getId(requestBody.time_slot_id);

  const order = await Order.query().insert({ ...data, customer_id: customerId, time_slot_id: timeSlotId });
  ctx.body = await Order.query().modify('publicColumns').findById(order.id);
}

module.exports = { handler, schema };
