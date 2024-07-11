/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import setupModels from "../../../shared/setupModels";

describe("GET /slots/:shop_id/available/:slot_id?", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() =>
    knex.raw("truncate orders, order_items, customers, users, products, time_slots, slots cascade;")
  );
  afterAll(() => knex.destroy());

  it("returns all available slots", async () => {
    const { section } = await DataFactory.createSlot();

    const response = await request
      .get(`/slots/${section.shop_id}/available`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchSnapshot({
      id: expect.any(Number),
      section_id: expect.any(String),
      user_id: expect.any(String),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });

  it("returns empty list of slots when there are no available slots", async () => {
    const slot = await DataFactory.createSlot({ active: false });

    const response = await request
      .get(`/slots/${slot.section.shop_id}/available`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("returns available specified slot", async () => {
    const slot = await DataFactory.createSlot();

    const response = await request
      .get(`/slots/${slot.section.shop_id}/available/${slot.id}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      section_id: expect.any(String),
      user_id: expect.any(String),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });

  it("returns available specified slot using uuid", async () => {
    const slot = await DataFactory.createSlot();

    const response = await request
      .get(`/slots/${slot.section.shop_id}/available/${slot.id}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      section_id: expect.any(String),
      user_id: expect.any(String),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });

  it("returns 422 for inactive specified slot", async () => {
    const slot = await DataFactory.createSlot({ active: false });

    const response = await request
      .get(`/slots/${slot.section.shop_id}/available/${slot.id}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: `Slot ${slot.uid} is not available!`
    });
  });

  it("throws 404 when specified slot does not exist", async () => {
    const slot = await DataFactory.createSlot();

    const randomSlotId = Math.floor(Math.random() * 100);
    const response = await request
      .get(`/slots/${slot.section.shop_id}/available/${randomSlotId}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("returns 422 for shop not yet opened", async () => {
    const slot = await DataFactory.createSlot();

    const startedAt = new Date();
    startedAt.setUTCHours(14, 55);

    const endedAt = new Date();
    endedAt.setUTCHours(18);

    const filters = `started_at=${startedAt.toISOString()}&ended_at=${endedAt.toISOString()}`;

    const response = await request
      .get(`/slots/${slot.section.shop_id}/available?${filters}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: `Shop is not open between "${startedAt.toISOString()}" - "${endedAt.toISOString()}"!`
    });
  });

  it("returns 422 for closed shop due to passed hour", async () => {
    const slot = await DataFactory.createSlot({ active: false });

    const startedAt = new Date();
    startedAt.setUTCHours(20);

    const endedAt = new Date();
    endedAt.setUTCHours(23, 30);

    const filters = `started_at=${startedAt.toISOString()}&ended_at=${endedAt.toISOString()}`;

    const response = await request
      .get(`/slots/${slot.section.shop_id}/available?${filters}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: `Shop is not open between "${startedAt.toISOString()}" - "${endedAt.toISOString()}"!`
    });
  });

  //TODO: implement
  it.skip("returns 422 for shop holiday", async () => {
    const slot = await DataFactory.createSlot({ active: false });

    const response = await request
      .get(`/slots/${slot.section.shop_id}/available`)
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: `Slot ${slot.uid} is not available!`
    });
  });

  // TODO: implement
  it.skip("returns all available slots based on date-time range", async () => {
    const slot1 = await DataFactory.createSlot();
    const slot2 = await DataFactory.createSlot({}, slot1.section, slot1.user, slot1.shop);

    const response = await request
      .get(`/slots/${slot1.section.shop_id}/available`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchSnapshot({
      id: expect.any(Number),
      section_id: expect.any(String),
      user_id: expect.any(String),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });
});
