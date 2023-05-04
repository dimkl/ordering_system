import type { Context, Next } from "koa";

import schema from "../schemas/customer.signup.json";
import { Customer } from "../models/customer";

import { createJwt } from "../helpers/createJwt";

const handler = async (ctx: Context, _next: Next) => {
  // @ts-ignore
  const { repeat_password, ...data } = ctx.request.validatedData;

  const { uuid } = await Customer.query()
    .modify("publicInsertColumns")
    .insert(data);

  ctx.body = await createJwt(uuid);
};

export { schema, handler };
