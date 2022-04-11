const Customer = require('../models/customer');

const handler = async (ctx, next) => {
  if (ctx.customer){
    ctx.body = ctx.customer;  
    return next();
  }
  ctx.body = await Customer.query().modify('publicColumns');
};

module.exports = { handler };