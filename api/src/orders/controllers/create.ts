import type { Context } from "koa";

import schema from "../schemas/order.create.json";

import { Order } from "../models";
import { Customer } from "../../customers/models/customer";
import { TimeSlot } from "../../availability/models";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;
  const bulkData = Array.isArray(data) ? data : [data];

  const orders = await Promise.all(
    bulkData.map(async (dt) => {
      const customerId = await Customer.getId(dt.customer_id);
      const timeSlotId = await TimeSlot.getId(dt.time_slot_id);

      return Order.query().insert({
        customer_id: customerId,
        time_slot_id: timeSlotId
      });
    })
  );

  const orderQs = Order.query().modify("publicColumns");
  ctx.body =
    orders.length > 1
      ? await orderQs.findByIds(orders.map((o) => o.id))
      : await orderQs.findById(orders[0].id);
};

export { schema, handler };
