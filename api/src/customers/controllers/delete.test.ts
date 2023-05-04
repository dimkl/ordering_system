/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import { v4 as uuidv4 } from "uuid";
import setupModels from "../../shared/setupModels";

describe("DELETE /customers/:customer_id", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() => knex.raw("truncate customers, orders cascade;"));
  afterAll(() => knex.destroy());

  it("deletes customer and returns 204", async () => {
    const customer = await DataFactory.createCustomer();

    const response = await request
      .delete(`/customers/${customer.uuid}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(204);
  });

  it("throws 404 when customer does not exist", async () => {
    const response = await request
      .delete(`/customers/${uuidv4()}`)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});
