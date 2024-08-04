import type { Slot, SlotProperties } from "../models/slot";

import QRCode from "qrcode";

type SerializedSlot = SlotProperties & {
  qr: string;
};

export class SlotSerilizer {
  async serialize(slots: Slot[]): Promise<SerializedSlot[]> {
    return Promise.all(
      slots.map(async (slot) => {
        return {
          ...(slot as SlotProperties),
          qr: await QRCode.toDataURL(slot.id)
        };
      })
    );
  }
}
