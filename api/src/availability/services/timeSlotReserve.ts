import { TimeSlot, Slot } from "../models";
import { Customer } from "../../customers/models/customer";

import { BusinessError } from "../../shared/errors";
import { snakeCaseKeys } from "../../shared/transformKeys";

type TimeSlotReserveParams = {
  customerId: number | string;
  slotId: number | string;
  startedAt?: string;
  endedAt?: string;
};
export class TimeSlotReserve {
  static async process({ customerId, slotId, ...data }: TimeSlotReserveParams) {
    const customer = await Customer.findByIdOrUid(customerId) as Customer;
    if (!customer) {
      throw new BusinessError(`Customer ${customerId} does not exist!`);
    }

    const slot = (await Slot.findByIdOrUid(slotId)
      .modify("active")
      .withGraphJoined("section.shop")) as Slot;
    if (!slot) {
      throw new BusinessError(`Slot ${slotId} does not exist!`);
    }

    const startedAt = data.startedAt ? new Date(data.startedAt) : null;
    const endedAt = data.endedAt ? new Date(data.endedAt) : null;

    if (!slot.section.shop.isOpen(startedAt, endedAt)) {
      const errMsgEndedAt = endedAt
        ? endedAt.toISOString()
        : slot.section.shop.closingDate(startedAt)?.toISOString();
      throw new BusinessError(
        `Shop is not open between "${startedAt?.toISOString()}" - "${errMsgEndedAt}"!`
      );
    }

    if (await this.hasIntersection(slot, data)) {
      const errMsgEndedAt = endedAt
        ? endedAt.toISOString()
        : slot.section.shop.closingDate(startedAt)?.toISOString();
      throw new BusinessError(
        `Time slot "${startedAt?.toISOString()}" - "${errMsgEndedAt}" is not available!`
      );
    }

    return TimeSlot.query()
      .modify("publicInsertColumns")
      .insert({
        ...snakeCaseKeys(data),
        customer_id: customer.id,
        slot_id: slot.id,
      });
  }

  // https://stackoverflow.com/questions/143552/comparing-date-ranges
  static async hasIntersection(
    slot: Slot,
    { startedAt, endedAt }: Pick<TimeSlotReserveParams, "startedAt" | "endedAt">
  ) {
    const defaultEndedAt = startedAt
      ? slot.section.shop.closingDate(new Date(startedAt))?.toISOString()
      : null;

    const timeSlotsCount = await TimeSlot.query()
      .where({ slot_id: slot.id })
      .modify("reserved", startedAt, endedAt || defaultEndedAt)
      .resultSize();

    return timeSlotsCount > 0;
  }
}
