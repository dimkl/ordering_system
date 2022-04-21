const ajv = require('../../shared/ajv');

const schema = require('../schemas/customer.create.json');
const Customer = require('../models/customer');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);
  const data = await validate(ctx.request.body);

  const customer = await Customer.query().insert(data);
  ctx.body = await Customer.query().modify('publicColumns').findById(customer.id);
}

module.exports = { handler, schema };
