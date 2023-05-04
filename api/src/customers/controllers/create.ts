import type { Context, Next } from "koa";

import schema from "../schemas/customer.create.json";
import { Customer } from "../models/customer";

const handler = async (ctx: Context, next: Next) => {
  const customer = await Customer.query().insert(
    // @ts-ignore
    ctx.request.validatedData
  );
  ctx.body = await Customer.query()
    .modify("publicColumns")
    .findById(customer.id);
};

export { schema, handler };
