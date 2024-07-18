import type { Context, Next } from "koa";

import { Category } from "../models";

export async function loadCategory(categoryId: number | string, ctx: Context, next: Next) {
  ctx.category = await Category.query().findById(categoryId).modify("publicColumns");

  if (!ctx.category) return (ctx.status = 404);

  return next();
}
