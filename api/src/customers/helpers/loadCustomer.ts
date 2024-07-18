import type { Context, Next } from "koa";

import { Customer } from "../models/customer";

export async function loadCustomer(customerId: string | number, ctx: Context, next: Next) {
  ctx.customer = await Customer.query().findById(customerId).modify("publicColumns");

  if (!ctx.customer) return (ctx.status = 404);

  return next();
}
