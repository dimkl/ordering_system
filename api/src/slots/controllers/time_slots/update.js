const ajv = require('../../../shared/ajv');

const Customer = require('../../../customers/models/customer');
const Slot = require('../../models/slot');

const schema = require('../../schemas/timeSlot.patch.json');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);
  const requestBody = ctx.request.body;

  const customerId = await Customer.getId(requestBody.customer_id)
  const slotId = await Slot.getId(requestBody.slot_id)

  const data = await validate(ctx.request.body);

  if (Object.keys(data).length > 0) {
    await ctx.timeSlot.$query().patch({ ...data, customer_id: customerId, slot_id: slotId });
  }

  ctx.body = await ctx.timeSlot.$query().modify('publicColumns');;
}

module.exports = { handler, schema };
