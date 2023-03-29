const Customer = require("../../../customers/models/customer");
const Slot = require("../../models/slot");

const schema = require("../../schemas/timeSlot.patch.json");

async function handler(ctx, next) {
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

module.exports = { handler, schema };
