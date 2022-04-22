/**
 * @integration-test true
 * @data-factory true
 */
const uuid = require('uuid');

describe("DELETE /orders/:order_id", () => {
  let knex;
  beforeAll(() => knex = require('../../shared/setupModels')());
  beforeEach(() => knex.raw('truncate orders, order_items, customers, users, products cascade;'));
  afterAll(() => knex.destroy());

  it("deletes customer and returns 204", async () => {
    const order = await DataFactory.createOrder();

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