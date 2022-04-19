const Customer = require('../models/customer');

async function loadCustomer(customerId, ctx, next) {
  ctx.customer = await Customer.findByIdOrUid(customerId).modify('publicColumns');

  if (!ctx.customer) return ctx.status = 404;

  return next();
}

module.exports = loadCustomer;