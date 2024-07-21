import { TimeSlot, Slot } from "../models";
import type { Shop } from "../../shops/models";
import { Customer } from "../../customers/models/customer";

import { BusinessError } from "../../shared/errors";
import { snakeCaseKeys } from "../../shared/transformKeys";

export type TimeSlotReserveParams = {
  customerId: number | string;
  slotId: number | string;
  startedAt?: string;
  endedAt?: string;
};
export class TimeSlotReserve {
  static async process({ customerId, slotId, ...data }: TimeSlotReserveParams) {
    const customer = (await Customer.query().findById(customerId)) as Customer;
    if (!customer) {
      throw new BusinessError(`Customer ${customerId} does not exist!`);
    }

    const slot = (await Slot.query()
      .findById(slotId)
      .modify("active")
      .withGraphJoined("section.shop")) as Slot;
    if (!slot) {
      throw new BusinessError(`Slot ${slotId} does not exist!`);
    }

    const shop = slot.section.shop;

    const defaultStartedAt = shop.openingDate(new Date())?.toISOString();
    const startedAt = new Date(data.startedAt || defaultStartedAt || "");
    const defaultEndedAt = shop.closingDate(new Date(startedAt))?.toISOString();
    const endedAt = new Date(data.endedAt || defaultEndedAt || "");

    if (!shop.isOpen(startedAt, endedAt)) {
      throw new BusinessError(
        `Shop is not open between "${startedAt.toISOString()}" - "${endedAt.toISOString()}"!`
      );
    }

    if (await this.hasIntersection(slot, shop, { startedAt, endedAt })) {
      throw new BusinessError(
        `Time slot "${startedAt.toISOString()}" - "${endedAt.toISOString()}" is not available!`
      );
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
