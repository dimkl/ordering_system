import type { Context, Next } from "koa";

import { Category } from "../../models";

export const handler = async (ctx: Context, next: Next) => {
  if (ctx.category) {
    ctx.body = ctx.category;
    return next();
  }
  ctx.body = await Category.query().modify("publicColumns");
};
