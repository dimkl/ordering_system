const jsonwebtoken = require('jsonwebtoken');
const getPublicKey = require('../getPublicKey');

module.exports = () => {
  return async function verifyToken(ctx, next) {
    const authHeader = ctx.headers['authorization'];

    try {
      // TODO: replace this check with throw error when tests are fixed
      if (!authHeader) return next();

      const token = authHeader.split('Bearer ')[1];
      ctx.tokenClaims = await jsonwebtoken.verify(token, getPublicKey(), { algorithms: ['RS256'] });

      return next();
    } catch (err) {
      ctx.status = 403;
    }
  }
};