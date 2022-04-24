const fs = require('fs');
const jsonwebtoken = require('jsonwebtoken');
const ajv = require('../../shared/ajv');

const schema = require('../schemas/customer.signup.json');
const Customer = require('../models/customer');

ajv.addSchema(schema);
ajv.validateSchema(schema);

const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'RS256';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || fs.readFileSync(__dirname + '/../../../config/private.key');

async function handler(ctx, next) {
  const validate = ajv.compile(schema);
  const { repeat_password, ...data } = await validate(ctx.request.body);

  const { id: customerId, uuid } = await Customer.query().modify('publicInsertColumns').insert(data);

  const customer = await Customer.query().modify('tokenColumns').findById(customerId);;
  const payload = { role: 'customer', sub: uuid, ...customer };

  ctx.body = await jsonwebtoken.sign(payload, JWT_PRIVATE_KEY, {
    expiresIn: JWT_EXPIRATION,
    algorithm: JWT_ALGORITHM
  });
}

module.exports = handler;
