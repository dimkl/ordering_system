const ajv = require('../../shared/ajv');

const schema = require('../schemas/customer.patch.json');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);

  const data = await validate(ctx.request.body);

  if (Object.keys(data).length > 0) {
    await ctx.customer.$query().patch(data);
  }

  ctx.body = await ctx.customer.$query().modify('publicColumns');;
}

module.exports = handler;
