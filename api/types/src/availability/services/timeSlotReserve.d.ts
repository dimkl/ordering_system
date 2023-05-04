import { TimeSlot, Slot } from "../models";
type TimeSlotReserveParams = {
    customerId: number | string;
    slotId: number | string;
    startedAt?: string;
    endedAt?: string;
};
export declare class TimeSlotReserve {
    static process({ customerId, slotId, ...data }: TimeSlotReserveParams): Promise<TimeSlot>;
    static hasIntersection(slot: Slot, { startedAt, endedAt }: Pick<TimeSlotReserveParams, "startedAt" | "endedAt">): Promise<boolean>;
}
export {};
