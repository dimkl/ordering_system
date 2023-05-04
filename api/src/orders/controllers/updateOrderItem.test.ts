/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import { v4 as uuidv4 } from "uuid";

import setupModels from "../../shared/setupModels";

describe("PATCH /order_items/:order_item_id", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() =>
    knex.raw(
      "truncate orders, order_items, customers, users, products cascade;"
    )
  );
  afterAll(() => knex.destroy());

  it("patch an order item", async () => {
    const orderItem = await DataFactory.createOrderItem();

    const response = await request
      .patch(`/order_items/${orderItem.uuid}`)
      .send({ quantity: 10 })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      uuid: orderItem.order.uuid,
      customer_id: orderItem.order.customer.uuid,
      order_items: expect.arrayContaining([
        expect.objectContaining({
          uuid: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          product: {
            title: "Product",
            uuid: orderItem.product.uuid,
            description: "Product description",
            qr: null,
          },
          quantity: 10,
          state: "draft",
        }),
      ]),
    });
    expect(response.body.order_items.length).toBe(1);
  });

  it("throws 404 for not existing order_item_id", async () => {
    const response = await request
      .patch(`/order_items/${uuidv4()}`)
      .send({ quantity: 10 })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("omits additional properties", async () => {
    const orderItem = await DataFactory.createOrderItem();

    const response = await request
      .patch(`/order_items/${orderItem.uuid}`)
      .send({ quantity: 10, created_at: "1680046371850" })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.order_id).not.toEqual("1680046371850");
  });
});
