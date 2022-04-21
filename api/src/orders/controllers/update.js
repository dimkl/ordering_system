const ajv = require('../../shared/ajv');

const Customer = require('../../customers/models/customer');
const TimeSlot = require('../../slots/models/timeSlot');

const schema = require('../schemas/order.patch.json');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);
  const requestBody = ctx.request.body;

  const data = await validate(ctx.request.body);
  const customerId = await Customer.getId(requestBody.customer_id);
  const timeSlotId = await TimeSlot.getId(requestBody.time_slot_id);

  if (Object.keys(data).length > 0) {
    await ctx.order.$query().patch({ ...data, customer_id: customerId, time_slot_id: timeSlotId });
  }

  ctx.body = await ctx.order.$query().modify('publicColumns');;
}

module.exports = { handler, schema };
