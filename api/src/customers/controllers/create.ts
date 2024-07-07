import type { Context } from "koa";

import schema from "../schemas/customer.create.json";
import { Customer } from "../models/customer";

const handler = async (ctx: Context) => {
  const customer = await Customer.query().insert(
    // @ts-expect-error validatedData are added as part of the request validation
    ctx.request.validatedData
  );
  ctx.body = await Customer.query().modify("publicColumns").findById(customer.id);
};

export { schema, handler };
