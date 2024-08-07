/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import { ulid } from "ulid";

import setupModels from "../../shared/setupModels";

describe("PATCH /order_items/:order_item_id", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() => knex.raw("truncate orders, order_items, customers, users, products cascade;"));
  afterAll(() => knex.destroy());

  it("patch an order item", async () => {
    const orderItem = await DataFactory.createOrderItem();

    const response = await request
      .patch(`/${apiVersion}/order_items/${orderItem.id}`)
      .send({ quantity: 10 })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: orderItem.order_id,
      created_at: expect.any(String),
      updated_at: expect.any(String),
      customer_id: orderItem.order.customer_id,
      order_items: expect.arrayContaining([
        expect.objectContaining({
          id: orderItem.id,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          product: {
            title: "Product",
            id: orderItem.product_id,
            description: "Product description"
          },
          quantity: 10,
          state: "draft"
        })
      ])
    });
    expect(response.body.order_items.length).toBe(1);
  });

  it("throws 404 for not existing order_item_id", async () => {
    const response = await request
      .patch(`/${apiVersion}/order_items/ort_${ulid()}`)
      .send({ quantity: 10 })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("omits additional properties", async () => {
    const orderItem = await DataFactory.createOrderItem();

    const response = await request
      .patch(`/${apiVersion}/order_items/${orderItem.id}`)
      .send({ quantity: 10, created_at: "1680046371850" })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.order_id).not.toEqual("1680046371850");
  });
});
