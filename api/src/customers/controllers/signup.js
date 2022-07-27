const ajv = require('../../shared/ajv');

const schema = require('../schemas/customer.signup.json');
const Customer = require('../models/customer');

const createJwt = require('../helpers/createJwt');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);
  const { repeat_password, ...data } = await validate(ctx.request.body);

  const { uuid } = await Customer.query().modify('publicInsertColumns').insert(data);

  ctx.body = await createJwt(uuid);
}

module.exports = handler;
