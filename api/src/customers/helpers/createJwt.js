const jsonwebtoken = require('jsonwebtoken');

const Customer = require('../models/customer');

const JWT_ALGORITHM = process.env.JWT_ALGORITHM || 'RS256';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

// function intersection(setA, setB) {
//   setB = new Set(setB);
//   return [...new Set(
//     [...setA].filter(element => setB.has(element))
//   )];
// }

async function createJwt(customerUuid, { role = 'customer' } = {}) {
  const customer = await Customer.query()
    .modify('tokenColumns')
    .throwIfNotFound()
    .where({ uuid: customerUuid })
    .first();

  // const allowedScopes = intersection(customer.scopes, scopes);
  const allowedScopes = customer.scopes.join(' ');

  const payload = {
    role,
    scopes: allowedScopes,
    sub: customerUuid,
    ...customer
  };

  const access_token = await jsonwebtoken.sign(payload, JWT_PRIVATE_KEY, {
    expiresIn: JWT_EXPIRATION,
    algorithm: JWT_ALGORITHM
  });

  return { role, access_token, scopes: allowedScopes };
}

module.exports = createJwt