import type { Context, Next } from "koa";

import schema from "../schemas/customer.patch.json";

const handler = async (ctx: Context, next: Next) => {
  //@ts-ignore
  const data = ctx.request.validatedData;
  if (Object.keys(data).length > 0) {
    await ctx.customer.$query().patch(data);
  }

  ctx.body = await ctx.customer.$query().modify("publicColumns");
};

export { schema, handler };
