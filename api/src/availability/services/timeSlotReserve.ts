import { TimeSlot, Slot } from "../models";
import type { Shop } from "../../shops/models";
import { Customer } from "../../customers/models/customer";

import * as errors from "../errors";
import { snakeCaseKeys } from "../../shared/transformKeys";

export type TimeSlotReserveParams = {
  customerId: string;
  slotId: string;
  startedAt?: string;
  endedAt?: string;
};
export class TimeSlotReserve {
  static async process({ customerId, slotId, ...data }: TimeSlotReserveParams) {
    const customer = (await Customer.query().findById(customerId)) as Customer;
    if (!customer) {
      throw new errors.NotFoundCustomerError(customerId);
    }

    const slot = (await Slot.query()
      .findById(slotId)
      .modify("active")
      .withGraphJoined("section.shop")) as Slot;
    if (!slot) {
      throw new errors.InactiveSlotError(slotId);
    }

    const shop = slot.section.shop;

    const defaultStartedAt = shop.openingDate(new Date())?.toISOString();
    const startedAt = new Date(data.startedAt || defaultStartedAt || "");
    const defaultEndedAt = shop.closingDate(new Date(startedAt))?.toISOString();
    const endedAt = new Date(data.endedAt || defaultEndedAt || "");

    if (!shop.isOpen(startedAt, endedAt)) {
      throw new errors.ClosedShopError(startedAt, endedAt);
    }

    if (await this.hasIntersection(slot, shop, { startedAt, endedAt })) {
      throw new errors.UnavailableTimeSlotError(startedAt, endedAt);
    }

    return TimeSlot.query()
      .modify("publicInsertColumns")
      .insert({
        ...snakeCaseKeys(data),
        customer_id: customer.id,
        slot_id: slot.id
      });
  }

  // https://stackoverflow.com/questions/143552/comparing-date-ranges
  static async hasIntersection(
    slot: Slot,
    shop: Shop,
    { startedAt, endedAt }: { startedAt?: Date; endedAt?: Date }
  ) {
    const timeSlotsCount = await TimeSlot.query()
      .where({ slot_id: slot.id })
      .modify("reserved", shop.id, startedAt, endedAt)
      .resultSize();

    return timeSlotsCount > 0;
  }
}
