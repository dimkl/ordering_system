import type { Context, Next } from "koa";

import schema from "../../schemas/timeSlot.reserve.json";
import { TimeSlotReserve } from "../../services/timeSlotReserve";

import { camelCaseKeys } from "../../../shared/transformKeys";

async function handler(ctx: Context, next: Next) {
  // @ts-ignore
  const data = ctx.request.validatedData;

  // @ts-ignore
  ctx.body = await TimeSlotReserve.process(camelCaseKeys(data));
}

export { schema, handler };
