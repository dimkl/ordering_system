import type { Context, Next } from "koa";

import { Slot } from "../../models";
import { BusinessError } from "../../../shared/errors";
import { SlotSerilizer } from "../../serializers/slot";

type SlotFilters = {
  capacity?: number;
  section_id?: string;
  started_at?: string;
  ended_at?: string;
};

const serializer = new SlotSerilizer();

export const handler = async (ctx: Context, next: Next) => {
  const filters = ctx.query as SlotFilters;

  if (ctx.slot) {
    if (!ctx.slot.active) {
      throw new BusinessError(`Slot ${ctx.slot.id} is not available!`);
    }

    ctx.body = (await serializer.serialize([ctx.slot]))[0];
    return next();
  }

  // TODO(dimkl): use start & end date
  // const startedAt = ctx.query.started_at || ctx.shop.openingDate(new Date()).toISOString();
  // const defaultEndedAt = ctx.shop.closingDate(new Date(startedAt)).toISOString();
  // const endedAt = ctx.query.ended_at || defaultEndedAt;

  let slotsQs = Slot.query().modify(["publicColumns", "active"]).modify("available", ctx.shop.id);

  if (filters.section_id) {
    slotsQs = slotsQs.where({
      section_id: filters.section_id
    });
  }

  if (Number.isInteger(Number(filters.capacity))) {
    slotsQs = slotsQs.where("capacity", ">=", Number(filters.capacity));
  }

  ctx.body = await serializer.serialize(await slotsQs);
};
