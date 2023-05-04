import type { Context, Next } from "koa";

import { Slot } from "../../models";
import { Section } from "../../../shops/models";
import { User } from "../../../users/models/user";

import schema from "../../schemas/slot.create.json";

const handler = async (ctx: Context, next: Next) => {
  // @ts-ignore
  const data = ctx.request.validatedData;
  const slotId = await Section.getId(data.section_id);
  const userId = await User.getId(data.user_id);

  ctx.body = await Slot.query()
    .modify("publicInsertColumns")
    .insert({
      ...data,
      user_id: userId,
      slot_id: slotId,
    });
};

export { handler, schema };
