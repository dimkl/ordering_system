const Customer = require("../../customers/models/customer");
const TimeSlot = require("../../availability/models/timeSlot");

const schema = require("../schemas/order.patch.json");

async function handler(ctx, next) {
  const data = ctx.request.validatedData;
  const customerId = await Customer.getId(data.customer_id);
  const timeSlotId = await TimeSlot.getId(data.time_slot_id);

  if (Object.keys(data).length > 0) {
    await ctx.order
      .$query()
      .patch({ customer_id: customerId, time_slot_id: timeSlotId });
  }

  ctx.body = await ctx.order.$query().modify("publicColumns");
}

module.exports = { schema, handler };
