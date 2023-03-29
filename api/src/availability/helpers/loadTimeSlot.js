const TimeSlot = require('../models/timeSlot');

async function loadTimeSlot(timeSlotId, ctx, next) {
  ctx.timeSlot = await TimeSlot.findByIdOrUid(timeSlotId).modify('publicColumns');

  if (!ctx.timeSlot) return ctx.status = 404;
  if (!ctx.slot) return next();

  if (ctx.timeSlot.order_id != ctx.slot.id) {
    ctx.status = 400;
    ctx.body = { message: `Order item ${ctx.timeSlot.id} does not belong to order ${ctx.slot.id}` };
    return;
  }

  return next();
}

module.exports = loadTimeSlot;