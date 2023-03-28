const schema = require("../schemas/customer.patch.json");

async function handler(ctx, next) {
  const data = ctx.request.validatedData;
  if (Object.keys(data).length > 0) {
    await ctx.customer.$query().patch(data);
  }

  ctx.body = await ctx.customer.$query().modify("publicColumns");
}

module.exports = { schema, handler };
