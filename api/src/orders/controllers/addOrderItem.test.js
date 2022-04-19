/**
 * @integration-test true
 */
const uuid = require('uuid');
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Customer = require("../../customers/models/customer");
const Product = require("../../products/models/product");

describe("POST /order_items", () => {
  let customer, order, product;
  beforeAll(async () => {
    require('../../shared/setupModels')();
    customer = await Customer.query().insert({
      "first_name": "Dimitris",
      "last_name": "Klouvas",
      "email": "dimitris.klouvas+order_items.create@gmail.com",
      "password": "1234"
    });
    order = await Order.query().insert({ customer_id: customer.id });
    product = await Product.query().insert({ title: 'Product', sku: 'product-sku' });
  });
  beforeEach(() => Order.knex().raw('truncate order_items cascade;'));
  afterAll(() => Customer.knex().destroy());

  it("creates and returns an order item", async () => {
    const response = await request.post(`/order_items`)
      .send({ product_id: product.uuid, order_id: order.uuid })
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
          quantity: 1,
          state: "draft"
        })
      ]),
    });
    expect(response.body.order_items.length).toBe(1);
  });

  it("creates and returns an order using internal order_id", async () => {
    const response = await request.post(`/order_items`)
      .send({ product_id: product.uuid, order_id: order.id })
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
          quantity: 1,
          state: "draft"
        })
      ]),
    });
    expect(response.body.order_items.length).toBe(1);
  });

  it("creates and returns an order using internal product_id", async () => {
    const response = await request.post(`/order_items`)
      .send({ product_id: product.id, order_id: order.uuid })
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
          quantity: 1,
          state: "draft"
        })
      ]),
    });
    expect(response.body.order_items.length).toBe(1);
  });

  it("throws validation error for required properties", async () => {
    const response = await request.post(`/order_items`)
      .send({})
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error with additional properties", async () => {
    const response = await request.post(`/order_items`)
      .send({ order_id: order.uuid, product_id: product.uuid, created_at: Date.now() })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws 404 for not existing order_id", async () => {
    const response = await request.post(`/order_items`)
      .send({ order_id: uuid.v4() })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  it("throws 404 for not existing product_id", async () => {
    const response = await request.post(`/order_items`)
      .send({ order_id: order.uuid, product_id: product.uuid + '1' })
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });

  describe('when existing order_item exists', () => {
    it('updates quantity of existing order_item based on product_id', async () => {
      await OrderItem.query().insert({ order_id: order.id, product_id: product.id });

      const response = await request.post(`/order_items`)
        .send({ order_id: order.uuid, product_id: product.uuid, quantity: 2 })
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
            quantity: 3,
            state: "draft"
          })
        ]),
      });
      expect(response.body.order_items.length).toBe(1);
    });
  });
});