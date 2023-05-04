import type { Context, Next } from "koa";

import { TimeSlot } from "../../models";

export const handler = async (ctx: Context, next: Next) => {
  if (ctx.timeSlot) {
    ctx.body = ctx.timeSlot;
    return next();
  }
  ctx.body = await TimeSlot.query().modify("publicColumns");
};
