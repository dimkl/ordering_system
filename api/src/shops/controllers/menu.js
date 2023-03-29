const schema = require("../schemas/shop.menu.json");

const handler = async (ctx, next) => {
  ctx.body = await ctx.shop.$query().modify("availableProducts");
};

module.exports = { schema, handler };
