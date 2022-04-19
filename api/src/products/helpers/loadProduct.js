const Product = require('../models/product');

async function loadProduct(productId, ctx, next) {
  ctx.product = await Product.findByIdOrUid(productId).modify('publicColumns');

  if (!ctx.product) return ctx.status = 404;

  return next();
}

module.exports = loadProduct;