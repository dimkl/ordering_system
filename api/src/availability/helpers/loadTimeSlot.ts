import type { Context, Next } from "koa";

import { TimeSlot } from "../models";

export async function loadTimeSlot(timeSlotId: number | string, ctx: Context, next: Next) {
  ctx.timeSlot = await TimeSlot.query().findById(timeSlotId).modify("publicColumns");

  if (!ctx.timeSlot) return (ctx.status = 404);
  if (!ctx.slot) return next();

  if (ctx.timeSlot.order_id != ctx.slot.id) {
    ctx.status = 400;
    ctx.body = {
      message: `Order item ${ctx.timeSlot.id} does not belong to order ${ctx.slot.id}`
    };
    return;
  }

  return next();
}
