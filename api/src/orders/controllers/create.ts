import type { Context } from "koa";

import schema from "../schemas/order.create.json";

import { Order } from "../models";
import { TimeSlotReserve } from "../../availability/services/timeSlotReserve";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;
  let bulkData = Array.isArray(data) ? data : [data];

  bulkData = await Promise.all(
    bulkData.map(async (params) => {
      const { time_slot_id: timeSlotId } = params;
      if (!timeSlotId) {
        const timeSlot = await TimeSlotReserve.process({
          customerId: params.customer_id,
          slotId: params.slot_id,
          startedAt: params.started_at,
          endedAt: params.ended_at
        });
        return { time_slot_id: timeSlot.id, customer_id: params.customer_id };
      }

      return params;
    })
  );

  const orders = await Order.query().insert(bulkData).returning("id");

  const orderQs = Order.query().modify("publicColumns");
  ctx.body =
    orders.length > 1
      ? await orderQs.findByIds(orders.map((o) => o.id))
      : await orderQs.findById(orders[0].id);
};

export { schema, handler };
