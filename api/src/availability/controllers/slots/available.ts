import type { Context, Next } from "koa";

import { Slot } from "../../models";
import { BusinessError } from "../../../shared/errors";

export const handler = async (ctx: Context, next: Next) => {
  if (ctx.slot) {
    if (!ctx.slot.active) {
      throw new BusinessError(`Slot ${ctx.slot.id} is not available!`);
    }

    ctx.body = ctx.slot;
    return next();
  }

  const startedAt = ctx.query.started_at || ctx.shop.openingDate(new Date()).toISOString();
  const defaultEndedAt = ctx.shop.closingDate(new Date(startedAt)).toISOString();
  const endedAt = ctx.query.ended_at || defaultEndedAt;

  ctx.body = await Slot.query()
    .modify(["publicColumns", "active"])
    // .modify("available", ctx.shop.id, startedAt, endedAt);
    .modify("available", ctx.shop.id, startedAt, endedAt);
};
