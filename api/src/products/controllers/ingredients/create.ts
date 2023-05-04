import type { Context, Next } from "koa";

import schema from "../../schemas/ingredient.create.json";
import { Ingredient } from "../../models";

const handler = async (ctx: Context, _next: Next) => {
  // @ts-ignore
  const data = ctx.request.validatedData;

  ctx.body = await Ingredient.query()
    .modify("publicInsertColumns")
    .insert(data);
};

export { schema, handler };
