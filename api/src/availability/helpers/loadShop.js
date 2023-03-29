const Shop = require('../../shops/models/shop');

async function loadShop(shopId, ctx, next) {
  ctx.shop = await Shop.findByIdOrUid(shopId).modify('publicColumns');

  if (!ctx.shop) return ctx.status = 404;

  return next();
}

module.exports = loadShop;