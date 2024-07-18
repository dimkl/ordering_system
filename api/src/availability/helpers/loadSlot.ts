import type { Context, Next } from "koa";

import { Slot } from "../models";

export async function loadSlot(slotId: number | string, ctx: Context, next: Next) {
  ctx.slot = await Slot.query().findById(slotId).modify("publicColumns").throwIfNotFound();

  return next();
}
