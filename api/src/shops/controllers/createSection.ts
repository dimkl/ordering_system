import type { Context } from "koa";

import schema from "../schemas/section.create.json";
import { Section } from "../models";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;

  ctx.body = await Section.query().modify("publicInsertColumns").insert(data);
};

export { schema, handler };
