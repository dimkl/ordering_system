const Category = require("../../models/category");

const handler = async (ctx, next) => {
  if (ctx.category) {
    ctx.body = ctx.category;
    return next();
  }
  ctx.body = await Category.query().modify("publicColumns");
};

module.exports = { handler };
