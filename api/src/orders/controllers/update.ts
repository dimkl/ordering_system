import type { Context } from "koa";

import { Customer } from "../../customers/models/customer";
import { TimeSlot } from "../../availability/models";

import schema from "../schemas/order.patch.json";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;
  const customerId = await Customer.getId(data.customer_id);
  const timeSlotId = await TimeSlot.getId(data.time_slot_id);

  if (Object.keys(data).length > 0) {
    await ctx.order
      .$query()
      .patch({ customer_id: customerId, time_slot_id: timeSlotId })
      .returning("*");
  }

  ctx.body = await ctx.order.$query().modify("publicColumns");
};

export { schema, handler };
