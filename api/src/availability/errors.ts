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

export class IncorrectSectiontIdForShopError extends BusinessError {
  message = "The section_id should be part of the shop provided!";
}
