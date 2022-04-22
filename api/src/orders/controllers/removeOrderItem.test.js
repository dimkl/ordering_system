/**
 * @integration-test true
 * @data-factory true
 */
const uuid = require('uuid');

describe("DELETE /order_items/:order_item_id", () => {
  let knex;
  beforeAll(() => knex = require('../../shared/setupModels')());
  beforeEach(() => knex.raw('truncate order_items, customers, users, products cascade;'));
  afterAll(() => knex.destroy());

  it("removes an order item", async () => {
    const orderItem = await DataFactory.createOrderItem();

    const response = await request.delete(`/order_items/${orderItem.uuid}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      uuid: orderItem.order.uuid,
      customer_id: orderItem.order.customer.uuid,
      order_items: []
    });
  });

  it("throws 404 for not existing order_item_id", async () => {
    const response = await request.delete(`/order_items/${uuid.v4()}`)
      .send({})
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});