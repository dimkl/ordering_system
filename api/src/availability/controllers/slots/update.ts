import type { Context } from "koa";

import { User } from "../../../users/models/user";
import { Section } from "../../../shops/models";

import schema from "../../schemas/slot.patch.json";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;
  const userId = await User.getId(data.user_id);
  const sectionId = await Section.getId(data.section_id);

  if (Object.keys(data).length > 0) {
    await ctx.slot
      .$query()
      .patch({ ...data, section_id: sectionId, user_id: userId })
      .returning("*");
  }

  ctx.body = await ctx.slot.$query().modify("publicColumns");
};

export { handler, schema };
