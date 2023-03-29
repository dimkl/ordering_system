const Shop = require("../models/shop");

const handler = async (ctx, next) => {
  if (ctx.shop) {
    ctx.body = ctx.shop;
    return next();
  }
  ctx.body = await Shop.query().modify("publicColumns");
};

module.exports = { handler };
