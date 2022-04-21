/**
 * @integration-test true
 * @data-factory true
 */
const Order = require("../models/order");

describe("POST /orders", () => {
  beforeAll(() => require('../../shared/setupModels')());
  beforeEach(() => Order.knex().raw('truncate orders, order_items, customers, users, products, time_slots, slots cascade;'));
  afterAll(() => Order.knex().destroy());

  it("creates and returns a order", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request.post("/orders")
      .send({ customer_id: timeSlot.customer.uuid, time_slot_id: timeSlot.uuid })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      customer_id: expect.any(String),
      time_slot_id: expect.any(String)
    });
    expect(response.body.customer_id).toEqual(timeSlot.customer.uuid);
  });

  it("creates and returns a order using internal customer_id", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request.post("/orders")
      .send({ customer_id: timeSlot.customer.id, time_slot_id: timeSlot.id })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      customer_id: expect.any(String),
      time_slot_id: expect.any(String)
    });
    expect(response.body.customer_id).toEqual(timeSlot.customer.uuid);
  });

  it("throws validation error for required properties", async () => {
    const response = await request.post("/orders")
      .send({})
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error for not existing customer_id", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request.post("/orders")
      .send({ customer_id: timeSlot.customer.uuid + '1', time_slot_id: timeSlot.uuid })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error for not existing time_slot_id", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request.post("/orders")
      .send({ customer_id: timeSlot.customer.uuid, time_slot_id: timeSlot.uuid  + '1' })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error with additional properties", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request.post("/orders")
      .send({ customer_id: timeSlot.customer.uuid, time_slot_id: timeSlot.uuid, created_at: Date.now() })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });
});