const schema = require("../schemas/order.create.json");

const Order = require("../models/order");
const Customer = require("../../customers/models/customer");
const TimeSlot = require("../../availability/models/timeSlot");

async function handler(ctx, next) {
  const data = ctx.request.validatedData;
  const customerId = await Customer.getId(data.customer_id);
  const timeSlotId = await TimeSlot.getId(data.time_slot_id);

  const order = await Order.query().insert({
    customer_id: customerId,
    time_slot_id: timeSlotId,
  });
  ctx.body = await Order.query().modify("publicColumns").findById(order.id);
}

module.exports = { schema, handler };
