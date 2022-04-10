const Customer = require('../models/customer');

module.exports = async (ctx, next) => {
  ctx.body = await Customer.query().modify('publicColumns');
}