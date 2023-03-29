const schema = require("../../schemas/product.create.json");
const Product = require("../../models/product");

async function handler(ctx, next) {
  const data = ctx.request.validatedData;

  ctx.body = await Product.query().modify("publicInsertColumns").insert(data);
}

module.exports = { schema, handler };
