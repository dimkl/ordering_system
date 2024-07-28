import type { Context } from "koa";

import schema from "../../schemas/timeSlot.available.json";

import { TimeSlotFindAvailable } from "../../services/timeSlotFindAvailable";

import { BusinessError } from "../../../shared/errors";

type Filters = {
  capacity?: number;
  section_id?: string;
  slot_id?: string;
  started_at?: string;
  ended_at?: string;
  // Duration in minutes
  duration?: number;
};

const handler = async (ctx: Context) => {
  // @ts-expect-error validatedData are added as part of the request validation
  const filters = ctx.request.validatedData as Filters;

  // The time_slot duration it should be provided in request, if shop does have a default
  const timeSlotDuration = filters.duration || ctx.shop.default_time_slot_duration;
  if (Number.isNaN(Number(timeSlotDuration))) {
    throw new BusinessError(`Please provide a reservation duration in minutes!`);
  }

  // TODO(dimkl): (optional) The capacity should be supported by the shop's slots
  // TODO(dimkl): (optional) The duration should be less than shop opening hours

  // TODO(dimkl): use start & end date
  // const startedAt = filters.started_at || ctx.shop.openingDate(new Date()).toISOString();
  // const defaultEndedAt = ctx.shop.closingDate(new Date(startedAt)).toISOString();
  // const endedAt = filters.ended_at || defaultEndedAt;

  ctx.body = await new TimeSlotFindAvailable().process({ ...filters, shop: ctx.shop });
};

export { schema, handler };
