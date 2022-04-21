const ajv = require('../../../shared/ajv');

const schema = require('../../schemas/timeSlot.create.json');
const TimeSlot = require('../../models/timeSlot');
const Slot = require('../../models/slot');
const Customer = require('../../../customers/models/customer');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);
  const requestBody = ctx.request.body;

  const data = await validate(requestBody);
  const customerId = await Customer.getId(requestBody.customer_id);
  const slotId = await Slot.getId(requestBody.slot_id);

  ctx.body = await TimeSlot.query().modify('publicInsertColumns').insert({
    ...data,
    customer_id: customerId,
    slot_id: slotId
  });
}

module.exports = { handler, schema };
