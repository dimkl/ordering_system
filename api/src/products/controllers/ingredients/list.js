const Ingredient = require("../../models/ingredient");

const handler = async (ctx, next) => {
  if (ctx.ingredient) {
    ctx.body = ctx.ingredient;
    return next();
  }
  ctx.body = await Ingredient.query().modify("publicColumns");
};

module.exports = { handler };
