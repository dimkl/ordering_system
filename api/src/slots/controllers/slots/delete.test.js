/**
 * @integration-test true
 * @data-factory true
 */
const Slot = require("../../models/slot");
const uuid = require('uuid');

describe("DELETE /slots/:slot_id", () => {
  beforeAll(() => require('../../../shared/setupModels')());
  beforeEach(() => Slot.knex().raw('truncate orders, order_items, customers, users, products, time_slots, slots cascade;'));
  afterAll(() => Slot.knex().destroy());

  it("deletes time_slot and returns 204", async () => {
    const slot = await DataFactory.createSlot();

    const response = await request.delete(`/slots/${slot.id}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  it("deletes time_slot using uuid and returns 204", async () => {
    const slot = await DataFactory.createSlot();

    const response = await request.delete(`/slots/${slot.uuid}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  it("throws 404 when time_slot does not exist", async () => {
    const response = await request.delete(`/slots/${uuid.v4()}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});