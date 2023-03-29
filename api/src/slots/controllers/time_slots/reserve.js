const schema = require("../../schemas/timeSlot.reserve.json");
const TimeSlotReserve = require("../../services/timeSlotReserve");

const { camelCaseKeys } = require("../../../shared/transformKeys");

async function handler(ctx, next) {
  const data = ctx.request.validatedData;

  ctx.body = await TimeSlotReserve.process(camelCaseKeys(data));
}

module.exports = { handler, schema };
