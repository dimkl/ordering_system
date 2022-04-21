/**
 * @integration-test true
 * @data-factory true
 */
const uuid = require('uuid');
const Order = require("../models/order");

describe("PATCH /order_items/:order_item_id", () => {
  beforeAll(() => require('../../shared/setupModels')());
  beforeEach(() => Order.knex().raw('truncate orders, order_items, customers, users, products cascade;'));
  afterAll(() => Order.knex().destroy());

  it("patch an order item", async () => {
    const orderItem = await DataFactory.createOrderItem();

    const response = await request.patch(`/order_items/${orderItem.uuid}`)
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
            title: 'Product',
            uuid: orderItem.product.uuid,
            description: "Product description",
            qr: null
          },
          quantity: 10,
          state: "draft"
        })
      ]),
    });
    expect(response.body.order_items.length).toBe(1);
  });

  it("throws 404 for not existing order_item_id", async () => {
    const response = await request.delete(`/order_items/${uuid.v4()}`)
      .send({})
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("throws validation error with additional properties", async () => {
    const orderItem = await DataFactory.createOrderItem();

    const response = await request.patch(`/order_items/${orderItem.uuid}`)
      .send({ quantity: 10, order_id: orderItem.order.id })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });
});