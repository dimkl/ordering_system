import type { Knex } from "knex";

import { slotIds, customerIds, timeSlotIds } from "../seed-constants";

export async function seed(knex: Knex) {
  const now = Date.now();

  await knex("time_slots").insert([
    {
      slot_id: slotIds.Table1,
      customer_id: customerIds.First,
      id: timeSlotIds.TimeSlot1,
      started_at: new Date(now),
      ended_at: new Date(now + 3600000)
    }
  ]);
}
