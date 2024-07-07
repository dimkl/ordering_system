import type { Context, Next } from "koa";

import { Ingredient } from "../models";

export async function loadIngredient(ingredientId: number | string, ctx: Context, next: Next) {
  ctx.ingredient = await Ingredient.findByIdOrUid(ingredientId).modify("publicColumns");

  if (!ctx.ingredient) return (ctx.status = 404);

  return next();
}
