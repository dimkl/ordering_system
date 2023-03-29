const schema = require("../../schemas/ingredient.create.json");
const Ingredient = require("../../models/ingredient");

async function handler(ctx, next) {
  const data = ctx.request.validatedData;

  ctx.body = await Ingredient.query()
    .modify("publicInsertColumns")
    .insert(data);
}

module.exports = { schema, handler };
