/**
 * @integration-test true
 */
const Order = require("../models/order");
const Customer = require("../../customers/models/customer");
const uuid = require('uuid');

describe("DELETE /orders/:order_id", () => {
  let customer;
  beforeAll(async () => {
    require('../../shared/setupModels')();
    customer = await Customer.query().insert({
      "first_name": "Dimitris",
      "last_name": "Klouvas",
      "email": "dimitris.klouvas+orders.delete@gmail.com",
      "password": "1234"
    });
  });
  beforeEach(() => Order.knex().raw('truncate orders cascade;'));
  afterAll(() => Customer.knex().destroy());

  it("deletes customer and returns 204", async () => {
    let order = await Order.query().insert({ customer_id: customer.id });

    const response = await request.delete(`/orders/${order.uuid}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  it("throws 404 when customer does not exist", async () => {
    const response = await request.delete(`/orders/${uuid.v4()}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});