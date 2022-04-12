const Product = require('../models/product');

const handler = async (ctx, next) => {
  if (ctx.product){
    ctx.body = ctx.product;  
    return next();
  }
  ctx.body = await Product.query().modify('publicColumns');
};

module.exports = { handler };