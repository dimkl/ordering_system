import type { Context, Next } from "koa";

import { TimeSlot } from "../models";

export async function loadTimeSlot(timeSlotId: number | string, ctx: Context, next: Next) {
  ctx.timeSlot = await TimeSlot.query()
    .findById(timeSlotId)
    .modify("publicColumns")
    .throwIfNotFound();

  if (!ctx.slot) return next();

  // TODO(dimkl): in what scenario is this used.
  // I cannot find a route with both of the path params defined
  if (ctx.timeSlot.order_id != ctx.slot.id) {
    ctx.status = 400;
    ctx.body = {
      message: `Order item ${ctx.timeSlot.id} does not belong to order ${ctx.slot.id}`
    };
    return;
  }

  return next();
}
