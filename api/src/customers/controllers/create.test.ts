/**
 * @integration-test true
 * @data-factory true
 */

import type { Knex } from "knex";

import setupModels from "../../shared/setupModels";

describe("POST /customers", () => {
  let knex: Knex;
  beforeAll(() => (knex = setupModels()));
  beforeEach(() => knex.raw("truncate customers, orders cascade;"));
  afterAll(() => knex.destroy());

  it("creates and returns a customer", async () => {
    const response = await request
      .post("/customers")
      .send({
        first_name: "Dimitris",
        last_name: "Klouvas",
        email: "dimitris.klouvas@gmail.com",
        password: "1234"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });

  it("throws validation error for required properties", async () => {
    const response = await request.post("/customers").send({}).set("Accept", "application/json");

    expect(response.status).toBe(400);
    expect(response.body).toMatchSnapshot();
  });

  it("throws validation error for unique email", async () => {
    const email = "customer@example.com";
    await DataFactory.createCustomer({
      first_name: "First",
      last_name: "Customer",
      email,
      password: "1234"
    });

    const response = await request
      .post("/customers")
      .send({
        first_name: "Dimitris",
        last_name: "Klouvas",
        email: email,
        password: "1234"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(422);
    expect(response.body).toMatchSnapshot();
  });

  it("omits additional properties", async () => {
    const response = await request
      .post("/customers")
      .send({
        first_name: "Dimitris",
        last_name: "Klouvas",
        email: "dimitris.klouvas@gmail.com",
        password: "1234",
        id: 2,
        created_at: "1680046371850"
      })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    expect(response.body.id).not.toEqual(2);
    expect(response.body.created_at).not.toEqual("1680046371850");
    expect(response.body).toMatchSnapshot({
      id: expect.any(Number),
      uuid: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String)
    });
  });
});
