import type { Context, Next } from "koa";

import { Customer } from "../models/customer";

export const handler = async (ctx: Context, next: Next) => {
  if (ctx.customer) {
    ctx.body = ctx.customer;
    return next();
  }
  ctx.body = await Customer.query().modify("publicColumns");
};