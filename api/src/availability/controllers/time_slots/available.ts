import type { Context } from "koa";

import schema from "../../schemas/timeSlot.available.json";

import { TimeSlotFindAvailable } from "../../services/timeSlotFindAvailable";
import { AvailableFilters } from "../../filters/availableFilters";
import { BusinessError } from "../../../shared/errors";

const handler = async (ctx: Context) => {
  const filters = new AvailableFilters(ctx.validatedData, {
    duration: ctx.shop.default_time_slot_duration
  });

  // The time_slot duration should be provided in request, if shop does NOT have a default
  if (Number.isNaN(Number(filters.duration))) {
    throw new BusinessError(`Please provide a reservation duration in minutes!`);
  }

  const service = new TimeSlotFindAvailable(filters);
  ctx.body = await service.process(ctx.shop);
};

export { schema, handler };
