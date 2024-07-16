import type { Context } from "koa";

import { BusinessError } from "../../shared/errors";

import schema from "../schemas/customer.login.json";
import { Customer } from "../models/customer";

import { createJwt } from "../helpers/createJwt";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const { email, password } = ctx.request.validatedData;

  const customer = await Customer.query().where({ email }).first();
  if (!customer) {
    throw new BusinessError("Password or email is not valid. Please try again!");
  }

  const isPasswordValid = await customer.verifyPassword(password);

  if (!isPasswordValid) {
    throw new BusinessError("Password or email is not valid. Please try again!");
  }

  ctx.body = await createJwt(customer.id);
};

export { schema, handler };
