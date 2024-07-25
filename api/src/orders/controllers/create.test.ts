/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import setupModels from "../../shared/setupModels";

describe("POST /orders", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() =>
    knex.raw("truncate orders, order_items, customers, users, products, time_slots, slots cascade;")
  );
  afterAll(() => knex.destroy());

  it("creates and returns a order", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request
      .post(`/${apiVersion}/orders`)
      .send({
        customer_id: timeSlot.customer_id,
        time_slot_id: timeSlot.id
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      customer_id: expect.any(String),
      time_slot_id: expect.any(String)
    });
    expect(response.body.customer_id).toEqual(timeSlot.customer_id);
  });

  it("creates and returns bulk orders", async () => {
    const timeSlot = await DataFactory.createTimeSlot();
    const otherTimeSlot = await DataFactory.createTimeSlot({}, timeSlot.customer, timeSlot.slot);

    const data = [
      {
        customer_id: timeSlot.customer_id,
        time_slot_id: timeSlot.id
      },
      {
        customer_id: otherTimeSlot.customer_id,
        time_slot_id: otherTimeSlot.id
      }
    ];

    const response = await request
      .post(`/${apiVersion}/orders`)
      .send(data)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      customer_id: expect.any(String),
      time_slot_id: expect.any(String)
    });
    expect(response.body[1]).toMatchSnapshot({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      customer_id: expect.any(String),
      time_slot_id: expect.any(String)
    });

    expect(response.body.map((d) => d.time_slot_id)).toEqual(
      expect.arrayContaining([timeSlot.id, otherTimeSlot.id])
    );
  });

  it("throws validation error for required properties", async () => {
    const response = await request
      .post(`/${apiVersion}/orders`)
      .send({})
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error for not existing customer_id", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request
      .post(`/${apiVersion}/orders`)
      .send({
        customer_id: timeSlot.customer_id.substring(0, -1) + "1",
        time_slot_id: timeSlot.id
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error for not existing time_slot_id", async () => {
    const timeSlot = await DataFactory.createTimeSlot();

    const response = await request
      .post(`/${apiVersion}/orders`)
      .send({
        customer_id: timeSlot.customer_id,
        time_slot_id: timeSlot.id + "1"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("omits additional properties", async () => {
    const timeSlot = await DataFactory.createTimeSlot();
    const customer = await DataFactory.createCustomer({
      email: "order.create@example.com"
    });

    const response = await request
      .post(`/${apiVersion}/orders`)
      .send({
        customer_id: customer.id,
        time_slot_id: timeSlot.id,
        created_at: "1680046371850"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.created_at).not.toEqual("1680046371850");
    expect(response.body.customer_id).toEqual(customer.id);
  });
});
