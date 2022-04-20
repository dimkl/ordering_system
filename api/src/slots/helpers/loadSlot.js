const Slot = require('../models/slot');

async function loadSlot(slotId, ctx, next) {
  ctx.slot = await Slot.findByIdOrUid(slotId).modify('publicColumns');

  if (!ctx.slot) return ctx.status = 404;

  return next();
}

module.exports = loadSlot;