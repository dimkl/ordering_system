import type { Context, Next } from "koa";

import { Order } from "../models";

export const handler = async (ctx: Context, next: Next) => {
  if (ctx.order) {
    ctx.body = ctx.order;
    return next();
  }
  ctx.body = await Order.query().modify("publicColumns");
};
