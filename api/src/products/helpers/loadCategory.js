const Category = require('../models/category');

async function loadCategory(categoryId, ctx, next) {
  ctx.category = await Category.findByIdOrUid(categoryId).modify('publicColumns');

  if (!ctx.category) return ctx.status = 404;

  return next();
}

module.exports = loadCategory;