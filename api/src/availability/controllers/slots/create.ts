import type { Context } from "koa";

import { Slot } from "../../models";

import schema from "../../schemas/slot.create.json";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;
  const bulkData = Array.isArray(data) ? data : [data];

  const slots = await Slot.query().insert(bulkData).returning("id");

  const slotQs = Slot.query().modify("publicColumns");
  ctx.body =
    slots.length > 1
      ? await slotQs.findByIds(slots.map((o) => o.id))
      : await slotQs.findById(slots[0].id);
};

export { handler, schema };
