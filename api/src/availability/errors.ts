import { BusinessError } from "../shared/errors";

export class ClosedShopError extends BusinessError {
  constructor(startedAt: Date, endedAt: Date) {
    super(`Shop is not open between "${startedAt.toISOString()}" - "${endedAt.toISOString()}"!`);
  }
}

export class ShopWithoutActiveSlotsError extends BusinessError {
  message = "The shop does not not have any active slots!";
}

export class InactiveSlotError extends BusinessError {
  constructor(slotId: string) {
    super(`Slot ${slotId} is not available!`);
  }
}

export class IncorrectSlotIdForShopError extends BusinessError {
  message = "The slot_id should be part of the shop provided!";
}

export class IncorrectSlotIdForSectionError extends BusinessError {
  message = "The slot_id should be part of the section provided!";
}

export class IncorrectSectionIdForShopError extends BusinessError {
  message = "The section_id should be part of the shop provided!";
}

export class DurationGreaterThanShopOpenHoursError extends BusinessError {
  message = "The duration should be less than shop open hours. Use a smaller duration!";
}

export class UnsupportedCapacityForShopError extends BusinessError {
  message = "The capacity should be less than shop slots capacity. Use a smaller capacity!";
}

export class UnavailableTimeSlotError extends BusinessError {
  constructor(startedAt: Date, endedAt: Date) {
    super(`Time slot "${startedAt.toISOString()}" - "${endedAt.toISOString()}" is not available!`);
  }
}

export class NotFoundCustomerError extends BusinessError {
  constructor(customerId: string) {
    super(`Customer ${customerId} does not exist!`);
  }
}
