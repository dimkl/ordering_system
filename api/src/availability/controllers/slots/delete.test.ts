/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import { ulid } from "ulid";

import setupModels from "../../../shared/setupModels";

describe("DELETE /slots/:slot_id", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() =>
    knex.raw("truncate orders, order_items, customers, users, products, time_slots, slots cascade;")
  );
  afterAll(() => knex.destroy());

  it("deletes time_slot and returns 204", async () => {
    const slot = await DataFactory.createSlot();

    const response = await request
      .delete(`/${apiVersion}/slots/${slot.id}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  it("deletes time_slot using uuid and returns 204", async () => {
    const slot = await DataFactory.createSlot();

    const response = await request
      .delete(`/${apiVersion}/slots/${slot.id}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  it("throws 404 when time_slot does not exist", async () => {
    const response = await request
      .delete(`/${apiVersion}/slots/slt_${ulid()}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});
