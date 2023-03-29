const schema = require("../../schemas/category.create.json");
const Category = require("../../models/category");

async function handler(ctx, next) {
  const data = ctx.request.validatedData;

  ctx.body = await Category.query().modify("publicInsertColumns").insert(data);
}

module.exports = { schema, handler };
