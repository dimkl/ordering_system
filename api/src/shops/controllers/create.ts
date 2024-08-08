import type { Context } from "koa";

import schema from "../schemas/shop.create.json";
import { Shop } from "../models";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;

  ctx.body = await Shop.query().modify("publicInsertColumns").insert(data);
};

export { schema, handler };
