const ajv = require('../../shared/ajv');

const schema = require('../schemas/customer.patch.json');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);

  const data = await validate(ctx.request.body);

  await ctx.customer.$query().patch(data);
  ctx.body = ctx.customer;
}

module.exports = { handler, schema };
