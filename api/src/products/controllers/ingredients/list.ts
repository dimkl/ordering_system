import type { Context, Next } from "koa";

import { Ingredient } from "../../models";

export const handler = async (ctx: Context, next: Next) => {
  if (ctx.ingredient) {
    ctx.body = ctx.ingredient;
    return next();
  }
  ctx.body = await Ingredient.query().modify("publicColumns");
};
