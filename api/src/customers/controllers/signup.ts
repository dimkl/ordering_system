import type { Context } from "koa";

import schema from "../schemas/customer.signup.json";
import { Customer } from "../models/customer";

import { createJwt } from "../helpers/createJwt";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { repeat_password, ...data } = ctx.request.validatedData;

  const { uuid } = await Customer.query().modify("publicInsertColumns").insert(data);

  ctx.body = await createJwt(uuid);
};

export { schema, handler };
