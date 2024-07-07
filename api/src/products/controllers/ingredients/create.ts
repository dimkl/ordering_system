import type { Context } from "koa";

import schema from "../../schemas/ingredient.create.json";
import { Ingredient } from "../../models";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;

  ctx.body = await Ingredient.query().modify("publicInsertColumns").insert(data);
};

export { schema, handler };
