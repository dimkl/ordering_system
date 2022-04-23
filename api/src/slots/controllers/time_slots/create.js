const ajv = require('../../../shared/ajv');

const schema = require('../../schemas/timeSlot.create.json');
const TimeSlotCreate = require('../../services/timeSlotCreate');

const { cameCaseKeys } = require('../../../shared/transformKeys');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);
  const requestBody = ctx.request.body;

  const data = await validate(requestBody);

  ctx.body = await TimeSlotCreate.process(requestBody.customer_id, requestBody.slot_id, cameCaseKeys(data));
}

module.exports = { handler, schema };
