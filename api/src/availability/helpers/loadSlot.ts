import type { Context, Next } from "koa";

import { Slot } from "../models";

export async function loadSlot(slotId: number | string, ctx: Context, next: Next) {
  ctx.slot = await Slot.findByIdOrUid(slotId).modify("publicColumns");

  if (!ctx.slot) return (ctx.status = 404);

  return next();
}
