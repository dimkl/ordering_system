const ajv = require('../../shared/ajv');
const { BusinessError } = require('../../shared/errors');

const schema = require('../schemas/customer.login.json');
const Customer = require('../models/customer');

const createJwt = require('../helpers/createJwt');

ajv.addSchema(schema);
ajv.validateSchema(schema);

async function handler(ctx, next) {
  const validate = ajv.compile(schema);
  const { email, password } = await validate(ctx.request.body);

  const customer = await Customer.query().where({ email }).first();
  const isPasswordValid = await customer.verifyPassword(password);

  if (!isPasswordValid) {
    throw new BusinessError('Password or email is not valid. Please try again!');
  }

  ctx.body = await createJwt(customer.uuid);
}

module.exports = handler;
