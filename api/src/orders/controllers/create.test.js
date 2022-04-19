/**
 * @integration-test true
 */
const Order = require("../models/order");
const Customer = require("../../customers/models/customer");

describe("POST /orders", () => {
  let customer;
  beforeAll(async () => {
    require('../../shared/setupModels')();
    customer = await Customer.query().insert({
      "first_name": "Dimitris",
      "last_name": "Klouvas",
      "email": "dimitris.klouvas+orders.create@gmail.com",
      "password": "1234"
    });
  });
  beforeEach(() => Order.knex().raw('truncate orders cascade;'));
  afterAll(() => Customer.knex().destroy());

  it("creates and returns a order", async () => {
    const response = await request.post("/orders")
      .send({ customer_id: customer.uuid })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      customer_id: expect.any(String)
    });
    expect(response.body.customer_id).toEqual(customer.uuid);
  });

  it("creates and returns a order using internal customer_id", async () => {
    const response = await request.post("/orders")
      .send({ customer_id: customer.id })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      customer_id: expect.any(String)
    });
    expect(response.body.customer_id).toEqual(customer.uuid);
  });

  it("throws validation error for required properties", async () => {
    const response = await request.post("/orders")
      .send({})
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error for not existing customer_id", async () => {
    const response = await request.post("/orders")
      .send({ customer_id: customer.uuid + '1' })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error with additional properties", async () => {
    const response = await request.post("/orders")
      .send({ customer_id: customer.uuid, created_at: Date.now() })
      .set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });
});