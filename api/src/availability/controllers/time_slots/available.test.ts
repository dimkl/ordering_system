/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import { ulid } from "ulid";

import setupModels from "../../../shared/setupModels";

describe("GET /time_slots/:shop_id/available/:slot_id?", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() =>
    knex.raw("truncate orders, order_items, customers, users, products, slots, time_slots cascade;")
  );
  afterAll(() => knex.destroy());

  it("returns all available time_slots", async () => {
    const { section, ...slot } = await DataFactory.createSlot();

    const response = await request
      .get(`/${apiVersion}/time_slots/${section.shop_id}/available`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);

    // opening and closing hours of the shop
    const startedAt = new Date();
    startedAt.setUTCHours(15, 0, 0, 0);
    const endedAt = new Date();
    endedAt.setUTCHours(23, 0, 0, 0);

    expect(response.body[0]).toMatchObject({
      slot_id: slot.id,
      section_id: section.id,
      started_at: (startedAt.getTime() / 1000) >> 0,
      ended_at: (endedAt.getTime() / 1000) >> 0
    });
  });

  it("returns all available time_slots - reserved time_slots are excluded", async () => {
    const reservedStartedAt = new Date();
    reservedStartedAt.setUTCHours(17, 0, 0, 0);
    const reservedEndedAt = new Date();
    reservedEndedAt.setUTCHours(19, 0, 0, 0);
    const { slot } = await DataFactory.createTimeSlot({
      started_at: reservedStartedAt,
      ended_at: reservedEndedAt
    });

    const response = await request
      .get(`/${apiVersion}/time_slots/${slot.section.shop_id}/available`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);

    // opening and closing hours of the shop
    const startedAt = new Date();
    startedAt.setUTCHours(15, 0, 0, 0);
    const endedAt = new Date();
    endedAt.setUTCHours(23, 0, 0, 0);

    expect(response.body[0]).toMatchObject({
      slot_id: slot.id,
      section_id: slot.section_id,
      started_at: (startedAt.getTime() / 1000) >> 0,
      ended_at: (reservedStartedAt.getTime() / 1000) >> 0
    });
    expect(response.body[1]).toMatchObject({
      slot_id: slot.id,
      section_id: slot.section_id,
      started_at: (reservedEndedAt.getTime() / 1000) >> 0,
      ended_at: (endedAt.getTime() / 1000) >> 0
    });
  });

  it("returns empty list of time_slots when completely reserved", async () => {
    const reservedStartedAt = new Date();
    const reservedEndedAt = new Date();

    reservedStartedAt.setUTCHours(17, 0, 0, 0);
    reservedEndedAt.setUTCHours(19, 0, 0, 0);
    const { slot, customer } = await DataFactory.createTimeSlot({
      started_at: reservedStartedAt,
      ended_at: reservedEndedAt
    });

    reservedStartedAt.setUTCHours(15, 0, 0, 0);
    reservedEndedAt.setUTCHours(17, 0, 0, 0);
    await DataFactory.createTimeSlot(
      {
        started_at: reservedStartedAt,
        ended_at: reservedEndedAt
      },
      customer,
      slot,
      slot.section,
      slot.user,
      slot.section.shop
    );

    reservedStartedAt.setUTCHours(21, 0, 0, 0);
    reservedEndedAt.setUTCHours(23, 30, 0, 0);
    await DataFactory.createTimeSlot(
      {
        started_at: reservedStartedAt,
        ended_at: reservedEndedAt
      },
      customer,
      slot,
      slot.section,
      slot.user,
      slot.section.shop
    );

    reservedStartedAt.setUTCHours(19, 0, 0, 0);
    reservedEndedAt.setUTCHours(21, 0, 0, 0);
    await DataFactory.createTimeSlot(
      {
        started_at: reservedStartedAt,
        ended_at: reservedEndedAt
      },
      customer,
      slot,
      slot.section,
      slot.user,
      slot.section.shop
    );

    const response = await request
      .get(`/${apiVersion}/time_slots/${slot.section.shop_id}/available`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(0);
  });

  it("returns 422 for inactive specified slot", async () => {
    const slot = await DataFactory.createSlot({ active: false });

    const response = await request
      .get(`/${apiVersion}/time_slots/${slot.section.shop_id}/available?slot_id=${slot.id}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: `Slot ${slot.id} is not available!`
    });
  });

  it("throws 404 when specified slot does not exist", async () => {
    const slot = await DataFactory.createSlot();

    const response = await request
      .get(`/${apiVersion}/time_slots/${slot.section.shop_id}/available?slot_id=slt_${ulid()}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("throws 404 when specified section does not exist", async () => {
    const slot = await DataFactory.createSlot();

    const response = await request
      .get(`/${apiVersion}/time_slots/${slot.section.shop_id}/available?section_id=sec_${ulid()}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("throws 404 when specified shop does not exist", async () => {
    const response = await request
      .get(`/${apiVersion}/time_slots/shp_${ulid()}/available}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  // TODO(dimkl): Add checks for params validations
  // - The section_id should be part of the shop provided
  // - The slot_id should be part of the shop provided
  // - The slot_id should be part of the section provided
  // - The capacity should be supported by the shop's slots
  // - The duration should be less than shop opening hours

  // TODO(dimkl): Add checks for business validations
  // - The shop should have active slots

  it("returns 422 for shop not yet opened", async () => {
    const slot = await DataFactory.createSlot();

    const startedAt = new Date();
    startedAt.setUTCHours(14, 55);

    const endedAt = new Date();
    endedAt.setUTCHours(18);

    const filters = `started_at=${startedAt.toISOString()}&ended_at=${endedAt.toISOString()}`;

    const response = await request
      .get(`/${apiVersion}/time_slots/${slot.section.shop_id}/available?${filters}`)
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
      .get(`/${apiVersion}/time_slots/${slot.section.shop_id}/available?${filters}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: `Shop is not open between "${startedAt.toISOString()}" - "${endedAt.toISOString()}"!`
    });
  });

  it("returns 422 for duration greater than shop open hours", async () => {
    const slot = await DataFactory.createSlot({ active: false });

    const filters = `duration=${8 * 60 + 1}`;

    const response = await request
      .get(`/${apiVersion}/time_slots/${slot.section.shop_id}/available?${filters}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: "The duration should be less than shop open hours. Use a smaller duration!"
    });
  });

  it("returns all available time_slots - time_slots with duration smaller than provided are excluded", async () => {
    const reservedStartedAt = new Date();
    reservedStartedAt.setUTCHours(17, 0, 0, 0);
    const reservedEndedAt = new Date();
    reservedEndedAt.setUTCHours(22, 30, 0, 0);
    const { slot } = await DataFactory.createTimeSlot({
      started_at: reservedStartedAt,
      ended_at: reservedEndedAt
    });

    const duration = 31;
    const response = await request
      .get(`/${apiVersion}/time_slots/${slot.section.shop_id}/available?duration=${duration}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);

    // opening and closing hours of the shop
    const startedAt = new Date();
    startedAt.setUTCHours(15, 0, 0, 0);

    expect(response.body[0]).toMatchObject({
      slot_id: slot.id,
      section_id: slot.section_id,
      started_at: (startedAt.getTime() / 1000) >> 0,
      ended_at: (reservedStartedAt.getTime() / 1000) >> 0
    });
  });

  //TODO: implement
  it.skip("returns 422 for shop holiday", async () => {
    const slot = await DataFactory.createSlot({ active: false });

    const response = await request
      .get(`/${apiVersion}/time_slots/${slot.section.shop_id}/available`)
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      message: `Slot ${slot.id} is not available!`
    });
  });

  it("returns all available time_slots based on date-time range", async () => {
    const slot = await DataFactory.createSlot();

    const startedAt = new Date();
    startedAt.setUTCHours(20);

    const endedAt = new Date();
    endedAt.setUTCHours(23, 0, 0, 0);
    const filters = `started_at=${startedAt.toISOString()}&ended_at=${endedAt.toISOString()}`;

    const response = await request
      .get(`/${apiVersion}/time_slots/${slot.section.shop_id}/available?${filters}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchObject({
      slot_id: slot.id,
      section_id: slot.section.id,
      started_at: (startedAt.getTime() / 1000) >> 0,
      ended_at: (endedAt.getTime() / 1000) >> 0
    });
  });

  it("returns empty list of time_slots when reserved based on date-time range", async () => {
    const reservedStartedAt = new Date();
    const reservedEndedAt = new Date();

    reservedStartedAt.setUTCHours(17, 0, 0, 0);
    reservedEndedAt.setUTCHours(19, 0, 0, 0);
    const { slot } = await DataFactory.createTimeSlot({
      started_at: reservedStartedAt,
      ended_at: reservedEndedAt
    });

    const filters = `started_at=${reservedStartedAt.toISOString()}&ended_at=${reservedEndedAt.toISOString()}`;

    const response = await request
      .get(`/${apiVersion}/time_slots/${slot.section.shop_id}/available?${filters}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });

  it("returns 400 for invalid filters", async () => {
    const slot = await DataFactory.createSlot({ active: false });

    const startedAt = new Date();
    startedAt.setUTCHours(20);

    const endedAt = new Date();
    endedAt.setUTCHours(23, 30);

    const filters = `started_at=true&ended_at=aloha&capacity=a&duration=-1&slot_id=1&section_id=1`;

    const response = await request
      .get(`/${apiVersion}/time_slots/${slot.section.shop_id}/available?${filters}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });
});
