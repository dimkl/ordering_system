/**
 * @integration-test true
 * @data-factory true
 */
const Customer = require("../models/customer");
const uuid = require('uuid');

describe("DELETE /customers/:customer_id", () => {
  beforeAll(() => require('../../shared/setupModels')());
  beforeEach(() => Customer.knex().raw('truncate customers, orders cascade;'));
  afterAll(() => Customer.knex().destroy());

  it("deletes customer and returns 204", async () => {
    const customer = await DataFactory.createCustomer();

    const response = await request.delete(`/customers/${customer.uuid}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  it("throws 404 when customer does not exist", async () => {
    const response = await request.delete(`/customers/${uuid.v4()}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});