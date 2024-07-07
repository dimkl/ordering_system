/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import setupModels from "../../../shared/setupModels";

describe("GET /time_slots", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() =>
    knex.raw("truncate orders, order_items, customers, users, products, time_slots, slots cascade;")
  );
  afterAll(() => knex.destroy());

  it("returns all time_slots", async () => {
    await DataFactory.createTimeSlot();

    const response = await request.get("/time_slots").set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchSnapshot({
      id: expect.any(Number),
      slot_id: expect.any(String),
      customer_id: expect.any(String),
      uuid: expect.any(String),
      started_at: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });

  it("returns specified time_slot", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request
      .get("/time_slots/" + timeSlot.id)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      slot_id: expect.any(String),
      customer_id: expect.any(String),
      uuid: expect.any(String),
      started_at: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });

  it("returns specified time_slot using uuid", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request
      .get("/time_slots/" + timeSlot.uuid)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      slot_id: expect.any(String),
      customer_id: expect.any(String),
      uuid: expect.any(String),
      started_at: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });

  it("returns empty list of time_slots when there are no time_slots", async () => {
    const response = await request.get("/time_slots").set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("throws 404 when specified time_slot does not exist", async () => {
    const response = await request
      .get("/time_slots/" + Math.floor(Math.random() * 100))
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});
