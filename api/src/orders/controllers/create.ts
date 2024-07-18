import type { Context } from "koa";

import { ForeignKeyViolationError } from "objection";

import schema from "../schemas/order.create.json";

import { Order } from "../models";

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData;
  const bulkData = Array.isArray(data) ? data : [data];

  try {
    const orders = await Order.query().insert(bulkData).returning("id");

    const orderQs = Order.query().modify("publicColumns");
    ctx.body =
      orders.length > 1
        ? await orderQs.findByIds(orders.map((o) => o.id))
        : await orderQs.findById(orders[0].id);
  } catch (err) {
    if (err instanceof ForeignKeyViolationError) {
      return;
    }
    throw err;
  }
};

export { schema, handler };
