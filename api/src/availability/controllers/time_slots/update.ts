import type { Context } from "koa";

import { ForeignKeyViolationError } from "objection";

import schema from "../../schemas/timeSlot.patch.json";

async function handler(ctx: Context) {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;

  if (Object.keys(data).length > 0) {
    try {
      await ctx.timeSlot.$query().patch(data).returning("*");
    } catch (err) {
      if (err instanceof ForeignKeyViolationError) {
        return;
      }
      throw err;
    }
  }

  ctx.body = await ctx.timeSlot.$query().modify("publicColumns");
}

export { schema, handler };
