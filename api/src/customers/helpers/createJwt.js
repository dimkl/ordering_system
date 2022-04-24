const fs = require('fs');
const jsonwebtoken = require('jsonwebtoken');

const Customer = require('../models/customer');

const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'RS256';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || fs.readFileSync(__dirname + '/../../../config/private.key');

const ROLE = 'customer';

async function createJwt(customerId, customerUuid) {
  const customer = await Customer.query().modify('tokenColumns').findById(customerId);;
  const payload = { role: ROLE, sub: customerUuid, ...customer };

  const access_token = await jsonwebtoken.sign(payload, JWT_PRIVATE_KEY, {
    expiresIn: JWT_EXPIRATION,
    algorithm: JWT_ALGORITHM
  });

  return { role: ROLE, access_token };
}

module.exports = createJwt