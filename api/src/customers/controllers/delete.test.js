/**
 * @integration-test true
 * @data-factory true
 */
const uuid = require('uuid');

describe("DELETE /customers/:customer_id", () => {
  let knex;
  beforeAll(() => knex = require('../../shared/setupModels')());
  beforeEach(() => knex.raw('truncate customers, orders cascade;'));
  afterAll(() => knex.destroy());

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