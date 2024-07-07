import type { Context } from "koa";

import schema from "../schemas/customer.patch.json";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;
  if (Object.keys(data).length > 0) {
    await ctx.customer.$query().patch(data).returning("*");
  }

  ctx.body = await ctx.customer.$query().modify("publicColumns");
};

export { schema, handler };
