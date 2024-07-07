import type { Context } from "koa";

import schema from "../../schemas/timeSlot.reserve.json";
import { TimeSlotReserve } from "../../services/timeSlotReserve";
import type { TimeSlotReserveParams } from "../../services/timeSlotReserve";

import { camelCaseKeys } from "../../../shared/transformKeys";

async function handler(ctx: Context) {
  // @ts-expect-error validatedData are added as part of the request validation
  const data = ctx.request.validatedData as TimeSlotReserveParams;

  ctx.body = await TimeSlotReserve.process(camelCaseKeys(data));
}

export { schema, handler };
