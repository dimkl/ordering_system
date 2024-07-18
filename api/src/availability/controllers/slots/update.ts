import type { Context } from "koa";

import schema from "../../schemas/slot.patch.json";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;

  if (Object.keys(data).length > 0) {
    await ctx.slot.$query().patch(data).returning("*");
  }

  ctx.body = await ctx.slot.$query().modify("publicColumns");
};

export { handler, schema };
