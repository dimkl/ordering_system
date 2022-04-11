const Customer = require('../models/customer');

const handler = async (ctx, next) => {
  ctx.body = await Customer.query().modify('publicColumns');
};

module.exports = { handler };