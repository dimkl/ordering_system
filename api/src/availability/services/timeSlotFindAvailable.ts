import { Shop } from "../../shops/models/";
import { TimeSlot, Slot } from "../models";
import { Section } from "../../shops/models";

import { AvailableFilters } from "../filters/availableFilters";

import * as errors from "../errors";

type TimeSlotAvailableResult = {
  slot_id: string;
  section_id: string;
  started_at: number;
  ended_at: number;
};

/**
 * Find available time_slots
 */
export class TimeSlotFindAvailable {
  #filters: AvailableFilters;
  constructor(filters: AvailableFilters) {
    this.#filters = filters;
  }

  async process(shop: Shop): Promise<TimeSlotAvailableResult[]> {
    let shopSlots = await Slot.query().modify("available", shop.id);
    if (shopSlots.length === 0) {
      throw new errors.ShopWithoutActiveSlotsError();
    }

    if (this.#filters.slot_id) {
      const selectedSlot = await Slot.query().findById(this.#filters.slot_id).throwIfNotFound();
      if (!shopSlots.some((s) => s.id == this.#filters.slot_id)) {
        throw new errors.IncorrectSlotIdForShopError();
      }
      if (!selectedSlot.active) {
        throw new errors.InactiveSlotError(selectedSlot.id);
      }

      if (this.#filters.section_id && this.#filters.section_id !== selectedSlot.section_id) {
        throw new errors.IncorrectSlotIdForSectionError();
      }
    }

    // The section_id should be part of the shop provided
    if (this.#filters.section_id) {
      const selectedSection = await Section.query()
        .findById(this.#filters.section_id)
        .throwIfNotFound();
      if (selectedSection.shop_id !== shop.id) {
        throw new errors.IncorrectSectionIdForShopError();
      }
    }

    // The duration should be less than shop opening hours
    if (Number(this.#filters.duration) > shop.openInMinutes()) {
      throw new errors.DurationGreaterThanShopOpenHoursError();
    }

    // The capacity should be supported by the shop's slots capacity
    if (this.#filters.capacity) {
      shopSlots = shopSlots.filter((slot) => slot.capacity >= Number(this.#filters.capacity));
      if (shopSlots.length === 0) {
        throw new errors.UnsupportedCapacityForShopError();
      }
    }

    const defaultStartedAt = shop.openingDate(new Date())?.toISOString();
    const startedAt = new Date(this.#filters.started_at || defaultStartedAt || "");
    const defaultEndedAt = startedAt && shop.closingDate(new Date(startedAt))?.toISOString();
    const endedAt = new Date(this.#filters.ended_at || defaultEndedAt || "");

    if (!shop.isOpen(startedAt, endedAt)) {
      throw new errors.ClosedShopError(startedAt, endedAt);
    }

    if (!endedAt || !startedAt) {
      return [];
    }

    let availableDateTimeRange: TimeSlotAvailableResult[] = [];
    await Promise.all(
      shopSlots.map(async (slot) => {
        const reservedTimeSlotsForSlot = await TimeSlot.query().modify(
          "reservedSlot",
          shop.id,
          startedAt,
          endedAt,
          slot.id
        );
        // when no reserved time_slot, return all the start - end range as available
        if (reservedTimeSlotsForSlot.length === 0) {
          availableDateTimeRange.push({
            slot_id: slot.id,
            section_id: slot.section_id,
            started_at: convertTimestampToEpoch(startedAt.getTime()),
            ended_at: convertTimestampToEpoch(endedAt.getTime())
          });
          return;
        }

        // create separate date-time ranges excluding reserved time slots
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

    // Exclude time_slots with duration smaller than duration provided
    if (this.#filters.duration) {
      const duration = this.#filters.duration;
      availableDateTimeRange = availableDateTimeRange.filter((result) => {
        // time_slots dates are in seconds, and duration is in minutes
        return (result.ended_at - result.started_at) / 60 > duration;
      });
    }

    return availableDateTimeRange;
  }
}

function convertTimestampToEpoch(t: number) {
  return (new Date(t).getTime() / 1000) >> 0;
}
