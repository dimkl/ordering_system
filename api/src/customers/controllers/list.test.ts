/**
 * @integration-test true
 * @data-factory true
 */
import type { Knex } from "knex";

import setupModels from "../../shared/setupModels";

describe("GET /customers/:customer_id?", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() => knex.raw("truncate customers, orders cascade;"));
  afterAll(() => knex.destroy());

  it("returns all customers", async () => {
    await DataFactory.createCustomer();

    const response = await request.get("/customers").set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchSnapshot({
      id: expect.any(Number),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });

  it("returns specified customer", async () => {
    const customer = await DataFactory.createCustomer();

    const response = await request
      .get("/customers/" + customer.id)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });

  it("returns specified customer using uuid", async () => {
    const customer = await DataFactory.createCustomer();

    const response = await request
      .get("/customers/" + customer.uuid)
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });

  it("returns empty list of customers when there are no customers", async () => {
    const response = await request.get("/customers").set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("throws 404 when specified customer does not exist", async () => {
    const response = await request
      .get("/customers/" + Math.floor(Math.random() * 100))
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
  });
});
