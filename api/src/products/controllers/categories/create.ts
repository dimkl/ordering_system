import type { Context, Next } from "koa";

import schema from "../../schemas/category.create.json";
import { Category } from "../../models";

const handler = async (ctx: Context, _next: Next) => {
  // @ts-ignore
  const data = ctx.request.validatedData;

  ctx.body = await Category.query().modify("publicInsertColumns").insert(data);
};

export { schema, handler };
