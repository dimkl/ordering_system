const ajv = require('../../../shared/ajv');

const schema = require('../../schemas/slot.patch.json');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);

  const data = await validate(ctx.request.body);

  await ctx.slot.$query().patch(data);
  ctx.body = ctx.slot;
}

module.exports = { handler, schema };
