/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import setupModels from "../../../shared/setupModels";

describe("POST /time_slots/reserve", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() =>
    knex.raw("truncate orders, order_items, customers, users, products, time_slots, slots cascade;")
  );
  afterAll(() => knex.destroy());

  it("reserves available time_slot and returns 200", async () => {
    const slot = await DataFactory.createSlot();
    const customer = await DataFactory.createCustomer();

    const startedAt = new Date();
    startedAt.setUTCHours(16);

    const endedAt = new Date();
    endedAt.setUTCHours(18);

    const response = await request
      .post("/time_slots/reserve")
      .send({
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        customer_id: customer.id,
        slot_id: slot.id
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      started_at: startedAt.toISOString(),
      ended_at: endedAt.toISOString(),
      customer_id: customer.id,
      slot_id: slot.id
    });
  });

  it("fails for reserved time_slot and returns 422", async () => {
    const startedAt = new Date();
    startedAt.setUTCHours(16);

    const endedAt = new Date();
    endedAt.setUTCHours(18);

    const timeSlot = await DataFactory.createTimeSlot({
      started_at: startedAt,
      ended_at: endedAt
    });

    const response = await request
      .post("/time_slots/reserve")
      .send({
        started_at: timeSlot.started_at.toISOString(),
        ended_at: timeSlot.ended_at.toISOString(),
        customer_id: timeSlot.customer_id,
        slot_id: timeSlot.slot_id
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: `Time slot "${startedAt.toISOString()}" - "${endedAt.toISOString()}" is not available!`
    });
  });

  // TODO: Add holidays in reverved slots
  it.skip("fails for shop holiday and returns 422", async () => {
    const customer = await DataFactory.createCustomer();
    const slot = await DataFactory.createSlot();
    await DataFactory.createHoliday(
      {
        date: new Date()
      },
      slot.section.shop,
      slot.user
    );

    const startedAt = new Date();
    startedAt.setUTCHours(16);

    const endedAt = new Date();
    endedAt.setUTCHours(18);

    const response = await request
      .post("/time_slots/reserve")
      .send({
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        customer_id: customer.id,
        slot_id: slot.id
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toEqual("");
  });

  it("fails for shop not yet opened and returns 422", async () => {
    const customer = await DataFactory.createCustomer();
    const slot = await DataFactory.createSlot();

    const startedAt = new Date();
    startedAt.setUTCHours(14, 55);

    const endedAt = new Date();
    endedAt.setUTCHours(18);

    const response = await request
      .post("/time_slots/reserve")
      .send({
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        customer_id: customer.id,
        slot_id: slot.id
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: `Shop is not open between "${startedAt.toISOString()}" - "${endedAt.toISOString()}"!`
    });
  });

  it("fails for closed shop due to passed hour and returns 422", async () => {
    const customer = await DataFactory.createCustomer();
    const slot = await DataFactory.createSlot();

    const startedAt = new Date();
    startedAt.setUTCHours(20);

    const endedAt = new Date();
    endedAt.setUTCHours(23, 30);

    const response = await request
      .post("/time_slots/reserve")
      .send({
        started_at: startedAt.toISOString(),
        ended_at: endedAt.toISOString(),
        customer_id: customer.id,
        slot_id: slot.id
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: `Shop is not open between "${startedAt.toISOString()}" - "${endedAt.toISOString()}"!`
    });
  });
});
