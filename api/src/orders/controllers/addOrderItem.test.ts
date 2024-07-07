/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import { v4 as uuidv4 } from "uuid";

import setupModels from "../../shared/setupModels";

describe("POST /order_items", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() => knex.raw("truncate orders, order_items, customers, users, products cascade;"));
  afterAll(() => knex.destroy());

  it("creates and returns an order item", async () => {
    const order = await DataFactory.createOrder();
    const product = await DataFactory.createProduct();

    const response = await request
      .post(`/order_items`)
      .send({ product_id: product.uuid, order_id: order.uuid })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      uuid: order.uuid,
      customer_id: order.customer.uuid,
      order_items: expect.arrayContaining([
        expect.objectContaining({
          uuid: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          product: {
            title: "Product",
            uuid: product.uuid,
            description: "Product description",
            qr: null
          },
          quantity: 1,
          state: "draft"
        })
      ])
    });
    expect(response.body.order_items.length).toBe(1);
  });

  it("creates and returns an order using internal order_id", async () => {
    const order = await DataFactory.createOrder();
    const product = await DataFactory.createProduct();

    const response = await request
      .post(`/order_items`)
      .send({ product_id: product.uuid, order_id: order.id })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      uuid: order.uuid,
      customer_id: order.customer.uuid,
      order_items: expect.arrayContaining([
        expect.objectContaining({
          uuid: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          product: {
            title: "Product",
            uuid: product.uuid,
            description: "Product description",
            qr: null
          },
          quantity: 1,
          state: "draft"
        })
      ])
    });
    expect(response.body.order_items.length).toBe(1);
  });

  it("creates and returns an order using internal product_id", async () => {
    const order = await DataFactory.createOrder();
    const product = await DataFactory.createProduct();

    const response = await request
      .post(`/order_items`)
      .send({ product_id: product.id, order_id: order.uuid })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      uuid: order.uuid,
      customer_id: order.customer.uuid,
      order_items: expect.arrayContaining([
        expect.objectContaining({
          uuid: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          product: {
            title: "Product",
            uuid: product.uuid,
            description: "Product description",
            qr: null
          },
          quantity: 1,
          state: "draft"
        })
      ])
    });
    expect(response.body.order_items.length).toBe(1);
  });

  it("throws validation error for required properties", async () => {
    const response = await request.post(`/order_items`).send({}).set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("omits additional properties", async () => {
    const order = await DataFactory.createOrder();
    const product = await DataFactory.createProduct();

    const response = await request
      .post(`/order_items`)
      .send({
        order_id: order.uuid,
        product_id: product.uuid,
        created_at: "1680046371850"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.order_items[0].product.uuid).toEqual(product.uuid);
    expect(response.body.created_at).not.toEqual("1680046371850");
  });

  it("throws 404 for not existing order_id", async () => {
    const product = await DataFactory.createProduct();

    const response = await request
      .post(`/order_items`)
      .send({ order_id: uuidv4(), product_id: product.uuid })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("throws 404 for not existing product_id", async () => {
    const order = await DataFactory.createOrder();

    const response = await request
      .post(`/order_items`)
      .send({ order_id: order.uuid, product_id: uuidv4() })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  describe("when existing order_item exists", () => {
    it("updates quantity of existing order_item based on product_id", async () => {
      const order = await DataFactory.createOrder();
      const product = await DataFactory.createProduct();
      await DataFactory.createOrderItem({ quantity: 1 }, { id: order.id }, { id: product.id });

      const response = await request
        .post(`/order_items`)
        .send({ order_id: order.uuid, product_id: product.uuid, quantity: 2 })
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        uuid: order.uuid,
        customer_id: order.customer.uuid,
        order_items: expect.arrayContaining([
          expect.objectContaining({
            uuid: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            product: {
              title: "Product",
              uuid: product.uuid,
              description: "Product description",
              qr: null
            },
            quantity: 3,
            state: "draft"
          })
        ])
      });
      expect(response.body.order_items.length).toBe(1);
    });
  });
});
