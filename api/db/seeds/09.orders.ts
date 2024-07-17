import type { Knex } from "knex";

import { customerIds, timeSlotIds, orderIds } from "../seed-constants";

export async function seed(knex: Knex) {
  await knex("orders").insert([
    {
      customer_id: customerIds.First,
      state: "draft",
      id: orderIds.Draft,
      time_slot_id: timeSlotIds.TimeSlot1
    }
  ]);
}
