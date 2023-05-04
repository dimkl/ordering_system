import type { Context, Next } from "koa";

import schema from "../schemas/order.create.json";

import { Order } from "../models";
import { Customer } from "../../customers/models/customer";
import { TimeSlot } from "../../availability/models";

const handler = async (ctx: Context, _next: Next) => {
  // @ts-ignore
  const data = ctx.request.validatedData;
  const customerId = await Customer.getId(data.customer_id);
  const timeSlotId = await TimeSlot.getId(data.time_slot_id);

  const order = await Order.query().insert({
    customer_id: customerId,
    time_slot_id: timeSlotId,
  });
  ctx.body = await Order.query().modify("publicColumns").findById(order.id);
};

export { schema, handler };
