/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import { ulid } from "ulid";
import setupModels from "../../../shared/setupModels";

describe("DELETE /time_slots/release/:time_slot_id", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() =>
    knex.raw("truncate orders, order_items, customers, users, products, time_slots, slots cascade;")
  );
  afterAll(() => knex.destroy());

  it("deletes time_slot and returns 204", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request
      .delete(`/${apiVersion}/time_slots/release/${timeSlot.id}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  it("deletes time_slot using uuid and returns 204", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request
      .delete(`/${apiVersion}/time_slots/release/${timeSlot.id}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  it("throws 404 when time_slot does not exist", async () => {
    const response = await request
      .delete(`/${apiVersion}/time_slots/release/tms_${ulid()}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});
