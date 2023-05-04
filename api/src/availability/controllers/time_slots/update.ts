import type { Context, Next } from "koa";

import { Customer } from "../../../customers/models/customer";
import { Slot } from "../../models";

import schema from "../../schemas/timeSlot.patch.json";

async function handler(ctx: Context, _next: Next) {
  // @ts-ignore
  const data = ctx.request.validatedData;
  const customerId = await Customer.getId(data.customer_id);
  const slotId = await Slot.getId(data.slot_id);

  if (Object.keys(data).length > 0) {
    await ctx.timeSlot
      .$query()
      .patch({ ...data, customer_id: customerId, slot_id: slotId });
  }

  ctx.body = await ctx.timeSlot.$query().modify("publicColumns");
}

export { schema, handler };
