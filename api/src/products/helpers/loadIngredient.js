const Ingredient = require('../models/ingredient');

async function loadIngredient(ingredientId, ctx, next) {
  ctx.ingredient = await Ingredient.findByIdOrUid(ingredientId).modify('publicColumns');

  if (!ctx.ingredient) return ctx.status = 404;

  return next();
}

module.exports = loadIngredient;