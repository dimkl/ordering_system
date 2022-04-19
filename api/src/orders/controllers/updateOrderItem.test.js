/**
 * @integration-test true
 */
const uuid = require('uuid');
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Customer = require("../../customers/models/customer");
const Product = require("../../products/models/product");

describe("PATCH /order_items/:order_item_id", () => {
  let customer, order, product;
  beforeAll(async () => {
    require('../../shared/setupModels')();
    customer = await Customer.query().insert({
      "first_name": "Dimitris",
      "last_name": "Klouvas",
      "email": "dimitris.klouvas+order_items.patch@gmail.com",
      "password": "1234"
    });
    order = await Order.query().insert({ customer_id: customer.id });
    product = await Product.query().insert({ title: 'Product', sku: 'product-sku' });
  });
  beforeEach(() => Order.knex().raw('truncate order_items cascade;'));
  afterAll(() => Customer.knex().destroy());

  it("patch order item", async () => {
    const orderItem = await OrderItem.query().insert({ order_id: order.id, product_id: product.id });
    const response = await request.patch(`/order_items/${orderItem.uuid}`)
      .send({ quantity: 10 })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      uuid: order.uuid,
      customer_id: customer.uuid,
      order_items: expect.arrayContaining([
        expect.objectContaining({
          uuid: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          product: {
            title: 'Product',
            uuid: product.uuid,
            description: null,
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
    const orderItem = await OrderItem.query().insert({ order_id: order.id, product_id: product.id });
    const response = await request.patch(`/order_items/${orderItem.uuid}`)
      .send({ quantity: 10, order_id: order.id })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });
});