/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import setupModels from "../../shared/setupModels";

describe("PATCH /orders/:order_id", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() =>
    knex.raw(
      "truncate orders, order_items, customers, users, products cascade;"
    )
  );
  afterAll(() => knex.destroy());

  it("updates and returns updated order", async () => {
    const order = await DataFactory.createOrder();
    const timeSlot = await DataFactory.createTimeSlot(
      {},
      { email: "order.update@example.com" },
      {},
      {},
      { email: "order.update@example.com" }
    );
    const response = await request
      .patch(`/orders/${order.uuid}`)
      .send({
        customer_id: timeSlot.customer.uuid,
        time_slot_id: timeSlot.uuid,
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: order.id,
      uuid: order.uuid,
      created_at: order.created_at.toISOString(),
      updated_at: expect.any(String),
      customer_id: timeSlot.customer.uuid,
      time_slot_id: timeSlot.uuid,
      state: "draft",
    });
    const unixUpdatedAt = new Date(response.body.updated_at).getTime();
    expect(unixUpdatedAt).toBeGreaterThan(order.updated_at.getTime());
  });

  it("does not have required properties", async () => {
    const order = await DataFactory.createOrder();

    const response = await request
      .patch(`/orders/${order.uuid}`)
      .send({})
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: order.id,
      uuid: order.uuid,
      created_at: order.created_at.toISOString(),
      updated_at: order.updated_at.toISOString(),
      customer_id: order.customer.uuid,
      time_slot_id: order.timeSlot.uuid,
      state: "draft",
    });
  });

  it("omits additional properties", async () => {
    const order = await DataFactory.createOrder();

    const response = await request
      .patch(`/orders/${order.uuid}`)
      .send({ created_at: "1680046371850" })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.created_at).not.toEqual("1680046371850");
  });
});
