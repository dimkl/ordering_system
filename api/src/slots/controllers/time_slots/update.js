const ajv = require('../../../shared/ajv');

const schema = require('../../schemas/timeSlot.patch.json');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);

  const data = await validate(ctx.request.body);

  await ctx.timeSlot.$query().patch(data);
  ctx.body = ctx.timeSlot;
}

module.exports = { handler, schema };
