/**
 * @integration-test true
 * @data-factory true
 */
const TimeSlot = require("../../models/timeSlot");
const uuid = require('uuid');

describe("DELETE /time_slots/:time_slot_id", () => {
  beforeAll(() => require('../../../shared/setupModels')());
  beforeEach(() => TimeSlot.knex().raw('truncate orders, order_items, customers, users, products, time_slots, slots cascade;'));
  afterAll(() => TimeSlot.knex().destroy());

  it("deletes time_slot and returns 204", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request.delete(`/time_slots/${timeSlot.id}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  it("deletes time_slot using uuid and returns 204", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request.delete(`/time_slots/${timeSlot.uuid}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  it("throws 404 when time_slot does not exist", async () => {
    const response = await request.delete(`/time_slots/${uuid.v4()}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});