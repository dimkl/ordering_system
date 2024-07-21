import { Shop } from "../../shops/models/";
import { TimeSlot, Slot } from "../models";
import { Section } from "../../shops/models";

import {
  ClosedShopError,
  ShopWithoutActiveSlotsError,
  InactiveSlotError,
  IncorrectSlotIdForShopError,
  IncorrectSlotIdForSectionError,
  IncorrectSectiontIdForShopError
} from "../errors";
// import { snakeCaseKeys } from "../../shared/transformKeys";

export type TimeSlotAvailableParams = {
  shop: Shop;
  capacity?: number;
  section_id?: string;
  slot_id?: string;
  started_at?: string;
  ended_at?: string;
  // Duration in minutes
  duration?: number;
};

type TimeSlotAvailableResult = {
  slot_id: string;
  section_id: string;
  started_at: number;
  ended_at: number;
};

/**
 * Find availanle timeslots base
 */
export class TimeSlotFindAvailable {
  async process({ shop, ...params }: TimeSlotAvailableParams): Promise<TimeSlotAvailableResult[]> {
    const shopSlots = await Slot.query().modify("available", shop.id);
    if (shopSlots.length === 0) {
      throw new ShopWithoutActiveSlotsError();
    }

    if (params.slot_id) {
      const selectedSlot = await Slot.query().findById(params.slot_id).throwIfNotFound();
      if (!shopSlots.some((s) => s.id == params.slot_id)) {
        throw new IncorrectSlotIdForShopError();
      }
      if (!selectedSlot.active) {
        throw new InactiveSlotError(selectedSlot.id);
      }

      if (params.section_id && params.section_id !== selectedSlot.section_id) {
        throw new IncorrectSlotIdForSectionError();
      }
    }

    // TODO(dimkl): (optional) The section_id should be part of the shop provided
    if (params.section_id) {
      const selectedSection = await Section.query().findById(params.section_id).throwIfNotFound();
      if (selectedSection.shop_id !== shop.id) {
        throw new IncorrectSectiontIdForShopError();
      }
    }

    // TODO(dimkl) Use duration to exclude smaller timeslots
    // const duration = params.duration || shop.default_time_slot_duration;

    const defaultStartedAt = shop.openingDate(new Date())?.toISOString();
    const startedAt = new Date(params.started_at || defaultStartedAt || "");
    const defaultEndedAt = startedAt && shop.closingDate(new Date(startedAt))?.toISOString();
    const endedAt = new Date(params.ended_at || defaultEndedAt || "");

    if (!shop.isOpen(startedAt, endedAt)) {
      throw new ClosedShopError(startedAt, endedAt);
    }

    if (!endedAt || !startedAt) {
      return [];
    }

    const availableDateTimeRange: TimeSlotAvailableResult[] = [];
    await Promise.all(
      shopSlots.map(async (slot) => {
        const reservedTimeSlotsForSlot = await TimeSlot.query().modify(
          "reservedSlot",
          shop.id,
          startedAt,
          endedAt,
          slot.id
        );
        // when no reserved timeslot, return all the start - end range as available
        if (reservedTimeSlotsForSlot.length === 0) {
          availableDateTimeRange.push({
            slot_id: slot.id,
            section_id: slot.section_id,
            started_at: convertTimestampToEpoch(startedAt.getTime()),
            ended_at: convertTimestampToEpoch(endedAt.getTime())
          });
          return;
        }

        // create separate datetime ranges excluding reserved time slots
        let currentStartDate = convertTimestampToEpoch(startedAt.getTime());
        reservedTimeSlotsForSlot.forEach((timeSlot) => {
          // add time range before the reserved time slot
          if (currentStartDate !== convertTimestampToEpoch(timeSlot.started_at)) {
            availableDateTimeRange.push({
              slot_id: slot.id,
              section_id: slot.section_id,
              started_at: currentStartDate,
              ended_at: convertTimestampToEpoch(timeSlot.started_at)
            });
          }

          currentStartDate = convertTimestampToEpoch(timeSlot.ended_at);
        });

        // add time range after the reserved time slot
        const currentEndedAt = convertTimestampToEpoch(endedAt.getTime());
        if (currentStartDate < currentEndedAt) {
          availableDateTimeRange.push({
            slot_id: slot.id,
            section_id: slot.section_id,
            started_at: currentStartDate,
            ended_at: currentEndedAt
          });
        }
      })
    );

    return availableDateTimeRange;
  }
}

function convertTimestampToEpoch(t: number) {
  return (new Date(t).getTime() / 1000) >> 0;
}
